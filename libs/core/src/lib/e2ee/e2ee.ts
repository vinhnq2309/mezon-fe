import { KeyStore } from './keystore';
import { arrayBufferEqual, concatArrayBuffers, eqSet } from './utils';

const subtle = window.crypto.subtle;

const CurveName = 'P-256';
const SignAlgo = { name: 'ECDSA', hash: 'SHA-256' };

const PubKeyIDLen = 32;

const AESWrapKeyFormat = 'raw';
const PrivateKeyExportFormat = 'jwk';

export class E2EEError extends Error {}
export class E2EEValidationError extends E2EEError {
	constructor() {
		super('integrity check failed');
	}
}
export class E2EEUnknownRecipient extends E2EEError {
	constructor() {
		super('unknown recipient');
	}
}
export class E2EEInvalidPrivKey extends E2EEError {
	constructor() {
		super('invalid private key metadata');
	}
}
export class E2EEInvalidJSONMessage extends E2EEError {
	constructor() {
		super('invalid message data');
	}
}

type B64Str = string;
type B64OrBuf = B64Str | ArrayBuffer;

interface PublicKeyMaterialJSONImpl<Bin extends B64OrBuf> {
	sign: Bin;
	encr: Bin;
}
export type PublicKeyMaterialJSON = PublicKeyMaterialJSONImpl<B64Str> | PublicKeyMaterialJSONImpl<ArrayBuffer>;

function base64Encode(buf: ArrayBuffer): string {
	return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64Decode(str: string): ArrayBuffer {
	return Uint8Array.from(atob(str), (c) => c.charCodeAt(0)).buffer;
}

function arrayBufferString(buf: ArrayBuffer): string {
	const decoder = new TextDecoder();
	return decoder.decode(buf);
}

function fencb64(tob64: boolean) {
	return tob64 ? base64Encode : arrayBufferString;
}

function stringArrayBuffer(str: string): ArrayBuffer {
	const enc = new TextEncoder();
	return enc.encode(str);
}

function fdecb64(fromb64: boolean) {
	return fromb64 ? base64Decode : stringArrayBuffer;
}

export class PublicKeyMaterial {
	readonly ecdh: CryptoKey;
	readonly ecdsa: CryptoKey;
	cachedID: ArrayBuffer | null;

	constructor(ecdh: CryptoKey, ecdsa: CryptoKey) {
		this.ecdh = ecdh;
		this.ecdsa = ecdsa;
		this.cachedID = null;
	}

	async jsonable(tob64 = true): Promise<PublicKeyMaterialJSON> {
		const encData = fencb64(tob64);
		const ecdhData = await subtle.exportKey('raw', this.ecdh);
		const ecdsaData = await subtle.exportKey('raw', this.ecdsa);
		return {
			sign: encData(ecdsaData),
			encr: encData(ecdhData)
		};
	}

	static async fromJsonable(obj: PublicKeyMaterialJSON, fromb64 = true): Promise<PublicKeyMaterial> {
		const decData = fdecb64(fromb64);
		const ecdh = await subtle.importKey('raw', decData(obj.encr as string), { name: 'ECDH', namedCurve: CurveName }, true, []);
		const ecdsa = await subtle.importKey('raw', decData(obj.sign as string), { name: 'ECDSA', namedCurve: CurveName }, true, ['verify']);
		return new PublicKeyMaterial(ecdh, ecdsa);
	}

	async id() {
		if (this.cachedID !== null) {
			return this.cachedID;
		}
		const data_ecdh = subtle.exportKey('raw', this.ecdh);
		const data_ecdsa = subtle.exportKey('raw', this.ecdsa);
		const data = concatArrayBuffers(...(await Promise.all([data_ecdh, data_ecdsa])));
		const ret = await subtle.digest('SHA-256', data);
		this.cachedID = ret;
		return ret;
	}
}

export interface PrivateKeyMaterialJSON {
	version: number;
	sign: JsonWebKey;
	encr: JsonWebKey;
}

export class PrivateKeyMaterial {
	readonly ecdh: CryptoKeyPair;
	readonly ecdsa: CryptoKeyPair;
	readonly pubkeyObj: PublicKeyMaterial;

	static readonly JSON_FORMAT_VERSION = 1;

	constructor(ecdh: CryptoKeyPair, ecdsa: CryptoKeyPair) {
		this.ecdh = ecdh;
		this.ecdsa = ecdsa;

		// We create this object once so that the ID of our private key will
		// be cached.
		this.pubkeyObj = new PublicKeyMaterial(this.ecdh.publicKey, this.ecdsa.publicKey);
	}

	async pubKeyID() {
		return (await this.pubKey()).id();
	}

	static async create(exportable = false): Promise<PrivateKeyMaterial> {
		const ecdh_key = subtle.generateKey(
			{
				name: 'ECDH',
				namedCurve: CurveName
			},
			exportable,
			['deriveBits']
		);
		const ecdsa_key = subtle.generateKey(
			{
				name: 'ECDSA',
				namedCurve: CurveName
			},
			exportable,
			['sign', 'verify']
		);
		const keys = await Promise.all([ecdh_key, ecdsa_key]);

		return new PrivateKeyMaterial(keys[0], keys[1]);
	}

	public async jsonable(tob64: boolean): Promise<PrivateKeyMaterialJSON> {
		const ecdsaExport = await subtle.exportKey(PrivateKeyExportFormat, this.ecdsa.privateKey);
		const ecdhExport = await subtle.exportKey(PrivateKeyExportFormat, this.ecdh.privateKey);
		return {
			sign: ecdsaExport,
			encr: ecdhExport,
			version: PrivateKeyMaterial.JSON_FORMAT_VERSION
		};
	}

	private static checkJWK(jwk: JsonWebKey, usages: Set<string>) {
		if (jwk.kty !== 'EC' || jwk.crv !== CurveName || !eqSet(new Set(jwk.key_ops), usages)) {
			throw new E2EEInvalidPrivKey();
		}
	}
	static async fromJsonable(data: PrivateKeyMaterialJSON, fromb64: boolean, exportable: boolean): Promise<PrivateKeyMaterial> {
		this.checkJWK(data.sign, new Set(['sign']));
		this.checkJWK(data.encr, new Set(['deriveBits']));
		const ecdsaPrivateKey = await subtle.importKey(PrivateKeyExportFormat, data.sign, { name: 'ECDSA', namedCurve: CurveName }, exportable, [
			'sign'
		]);
		const ecdhPrivateKey = await subtle.importKey(PrivateKeyExportFormat, data.encr, { name: 'ECDH', namedCurve: CurveName }, exportable, [
			'deriveBits'
		]);

		const pubSign = Object.assign({}, data.sign);
		delete pubSign.d;
		pubSign.key_ops = ['verify'];
		const ecdsaPublicKey = await subtle.importKey(PrivateKeyExportFormat, pubSign, { name: 'ECDSA', namedCurve: CurveName }, true, ['verify']);

		const pubEncr = Object.assign({}, data.encr);
		delete pubEncr.d;
		pubEncr.key_ops = [];
		const ecdhPublicKey = await subtle.importKey(PrivateKeyExportFormat, pubEncr, { name: 'ECDH', namedCurve: CurveName }, true, []);

		return new PrivateKeyMaterial(
			{
				privateKey: ecdhPrivateKey,
				publicKey: ecdhPublicKey
			},
			{
				privateKey: ecdsaPrivateKey,
				publicKey: ecdsaPublicKey
			}
		);
	}

	public async save(ks: KeyStore, userID: string, erase = false) {
		return Promise.all([ks.saveKey('ecdh_' + userID, this.ecdh, erase), ks.saveKey('ecdsa_' + userID, this.ecdsa, erase)]);
	}

	static async load(ks: KeyStore, userID: string): Promise<PrivateKeyMaterial> {
		const ecdh_key = ks.loadKey('ecdh_' + userID);
		const ecdsa_key = ks.loadKey('ecdsa_' + userID);
		const values = await Promise.all([ecdh_key, ecdsa_key]);
		return new PrivateKeyMaterial(values[0], values[1]);
	}

	privSignKey(): CryptoKey {
		return this.ecdsa.privateKey;
	}

	pubSignKey(): CryptoKey {
		return this.ecdsa.publicKey;
	}

	pubECDHKey(): CryptoKey {
		return this.ecdh.publicKey;
	}

	pubKey(): PublicKeyMaterial {
		return this.pubkeyObj;
	}
}

export async function getECPubkeyID(pubkey: CryptoKey): Promise<ArrayBuffer> {
	const data = await subtle.exportKey('raw', pubkey);
	return subtle.digest('SHA-256', data);
}

export async function pubkeyEqual(A: PublicKeyMaterial, B: PublicKeyMaterial): Promise<boolean> {
	const idA = await A.id();
	const idB = await B.id();
	return arrayBufferEqual(idA, idB);
}

type EncryptedKeyWithIDTy = [ArrayBuffer, ArrayBuffer];
type EncryptedKeyTy = EncryptedKeyWithIDTy[];

interface EncryptedP2PMessageJSONImpl<Bin extends B64OrBuf> {
	version: number;
	signature: Bin;
	iv: Bin;
	pubECDHE: Bin;
	encryptedKey: [Bin, Bin][];
	encryptedData: Bin;
}
export type EncryptedP2PMessageJSON = EncryptedP2PMessageJSONImpl<B64Str> | EncryptedP2PMessageJSONImpl<ArrayBuffer>;

export function isEncryptedP2PMessageJSON(obj: any, hasb64 = true): obj is EncryptedP2PMessageJSON {
	if (typeof obj !== 'object') {
		return false;
	}
	const strOrArray = hasb64 ? (v: any) => typeof v === 'string' : (v: any) => v instanceof ArrayBuffer;
	try {
		if (!Array.isArray(obj.encryptedKey)) {
			return false;
		}
		for (const [kid, key] of obj.encryptedKey) {
			if (!strOrArray(kid) || !strOrArray(key)) {
				return false;
			}
		}
		return (
			typeof obj.version === 'number' &&
			strOrArray(obj.signature) &&
			strOrArray(obj.iv) &&
			strOrArray(obj.pubECDHE) &&
			strOrArray(obj.encryptedData)
		);
	} catch (e) {
		return false;
	}
}

export class EncryptedP2PMessage {
	signature!: ArrayBuffer;
	iv!: Uint8Array;
	pubECDHE!: CryptoKey;

	// Map public key ID to encrypted AES key
	encryptedKey!: EncryptedKeyTy;
	encryptedData!: ArrayBuffer;

	static readonly JSON_FORMAT_VERSION = 1;

	private static async deriveSharedKey(pubkey: CryptoKey, privkey: CryptoKey, usage: 'wrapKey' | 'unwrapKey'): Promise<CryptoKey> {
		// 32*8 because it seems to gives us the raw output of the ECDH algorithm
		// on P-256, with only one coordinate (see
		// https://www.w3.org/TR/WebCryptoAPI/#ecdh-operations)
		const sharedECDH = await subtle.deriveBits({ name: 'ECDH', public: pubkey }, privkey, 32 * 8);
		const sharedHash = await subtle.digest('SHA-256', sharedECDH);
		return subtle.importKey('raw', new DataView(sharedHash, 0, 16), { name: 'AES-KW' }, false, [usage]);
	}

	static async encrypt(data: ArrayBuffer, sign: PrivateKeyMaterial, pubkeys: Array<PublicKeyMaterial>): Promise<EncryptedP2PMessage> {
		//assert(signkey.type == "private")
		const ret = new EncryptedP2PMessage();
		ret.iv = new Uint8Array(16);
		window.crypto.getRandomValues(ret.iv);
		const msgKey = await subtle.generateKey({ name: 'AES-CTR', length: 128 }, true, ['encrypt']);
		const ecdheKey = await subtle.generateKey(
			{
				name: 'ECDH',
				namedCurve: CurveName
			},
			false,
			['deriveBits']
		);
		ret.pubECDHE = ecdheKey.publicKey;

		// For each public key, generate a shared secret, and use the result to
		// encrypt msgAesKey.
		// We create one promise per key to exploit parallelism if possible.
		const keysProm: Promise<EncryptedKeyWithIDTy>[] = [];
		for (const pubkey of pubkeys) {
			const gen = async (): Promise<EncryptedKeyWithIDTy> => {
				const pubkeyID = pubkey.id();
				const sharedKey = await EncryptedP2PMessage.deriveSharedKey(pubkey.ecdh, ecdheKey.privateKey, 'wrapKey');
				const encrMsgKey = await subtle.wrapKey(AESWrapKeyFormat, msgKey, sharedKey, 'AES-KW');
				return [await pubkeyID, encrMsgKey];
			};
			keysProm.push(gen());
		}

		// Encrypt data
		ret.encryptedData = await subtle.encrypt({ name: 'AES-CTR', counter: ret.iv, length: 64 }, msgKey, data);

		// Sign data
		ret.encryptedKey = await Promise.all(keysProm);
		ret.signature = await subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, sign.ecdsa.privateKey, await ret.signData());
		return ret;
	}

	private async signData() {
		const pubid = getECPubkeyID(this.pubECDHE);
		const nkeys = this.encryptedKey.length;
		const encrKeysLen = 4 + nkeys * PubKeyIDLen;
		const encrKeys = new Uint8Array(encrKeysLen);
		new DataView(encrKeys.buffer).setUint32(0, nkeys, true /* littleEndian */);
		for (let i = 0; i < nkeys; ++i) {
			const [id, _] = this.encryptedKey[i];
			encrKeys.set(new Uint8Array(id), 4 + i * PubKeyIDLen);
		}
		const encrMsgLen = new DataView(this.encryptedData).byteLength;
		const encrMsgLenBuf = new ArrayBuffer(4);
		new DataView(encrMsgLenBuf).setUint32(0, encrMsgLen, true /* littleEndian */);
		return concatArrayBuffers(this.iv, await pubid, encrKeys, encrMsgLenBuf, this.encryptedData);
	}

	// Throws E2EEValidationError if verification fails
	public async verifyAndDecrypt(senderkey: PublicKeyMaterial, privkey: PrivateKeyMaterial): Promise<ArrayBuffer> {
		if ((await this.verify(senderkey)) === false) {
			throw new E2EEValidationError();
		}

		return this.decrypt(privkey);
	}

	public async verify(senderkey: PublicKeyMaterial): Promise<boolean> {
		return subtle.verify(SignAlgo, senderkey.ecdsa, this.signature, await this.signData());
	}

	public async decrypt(privkey: PrivateKeyMaterial): Promise<ArrayBuffer> {
		const ecdhKey = privkey.ecdh;
		const pubkeyID = await privkey.pubKeyID();
		const encrMsgKeyData = this.encryptedKey.find(([pkid, _]) => arrayBufferEqual(pkid, pubkeyID));
		if (typeof encrMsgKeyData === 'undefined') {
			throw new E2EEUnknownRecipient();
		}
		const encrMsgKey = encrMsgKeyData[1];

		// Compute shared key
		const sharedKey = await EncryptedP2PMessage.deriveSharedKey(this.pubECDHE, ecdhKey.privateKey, 'unwrapKey');

		// Decrypt key & data
		const aesCTRInfos = { name: 'AES-CTR', counter: this.iv, length: 64 };
		let msgKey: CryptoKey;
		try {
			msgKey = await subtle.unwrapKey(AESWrapKeyFormat, encrMsgKey, sharedKey, 'AES-KW', aesCTRInfos, false, ['decrypt']);
		} catch (e) {
			if (e instanceof DOMException && e.name === 'OperationError') {
				// thrown if an integrity issue is found.
				throw new E2EEValidationError();
			}
			throw e;
		}
		return subtle.decrypt(aesCTRInfos, msgKey, this.encryptedData);
	}

	public async jsonable(tob64 = true): Promise<EncryptedP2PMessageJSON> {
		const encData = fencb64(tob64);
		const pubECDHEData = await subtle.exportKey('raw', this.pubECDHE);
		const encryptedKeyData: [B64Str, B64Str][] & [ArrayBuffer, ArrayBuffer][] = [];
		for (const [pubkeyID, encrKey] of this.encryptedKey) {
			encryptedKeyData.push([encData(pubkeyID), encData(encrKey)]);
		}
		return {
			signature: encData(this.signature),
			iv: encData(this.iv),
			pubECDHE: encData(pubECDHEData),
			encryptedKey: encryptedKeyData,
			encryptedData: encData(this.encryptedData),
			version: EncryptedP2PMessage.JSON_FORMAT_VERSION
		};
	}

	static async fromJsonable(data: any, fromb64 = true): Promise<EncryptedP2PMessage> {
		if (!isEncryptedP2PMessageJSON(data, fromb64)) {
			throw new E2EEInvalidJSONMessage();
		}
		const decData = fdecb64(fromb64);
		const ret = new EncryptedP2PMessage();
		ret.signature = decData(data.signature as string);
		ret.iv = new Uint8Array(decData(data.iv as string));
		ret.encryptedData = decData(data.encryptedData as string);
		ret.encryptedKey = [];
		for (const [pubkeyID, encrKey] of data.encryptedKey) {
			ret.encryptedKey.push([decData(pubkeyID as string), decData(encrKey as string)]);
		}
		const pubECDHEData = decData(data.pubECDHE as string);
		ret.pubECDHE = await subtle.importKey('raw', pubECDHEData, { name: 'ECDH', namedCurve: CurveName }, true, []);
		return ret;
	}
}
