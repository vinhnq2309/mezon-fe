import { Buffer as BufferMobile } from 'buffer';
import { Client, Session } from 'mezon-js';
import { ApiMessageAttachment } from 'mezon-js/api.gen';

export class CustomFile extends File {
	url?: string;
	width?: number;
	height?: number;
}

export const isValidUrl = (urlString: string) => {
	let url;
	try {
		url = new URL(urlString);
	} catch (e) {
		return false;
	}
	return url.protocol === 'https:';
};

export function uploadImageToMinIO(url: string, stream: Buffer, size: number) {
	return fetch(url, { method: 'PUT', body: stream });
}

export function uploadImageToMinIOMobile(url: string, stream: Buffer, type: string, size: number) {
	// Add header to upload success on mobile
	return fetch(url, {
		method: 'PUT',
		body: stream,
		headers: {
			'Content-Type': type,
			'Content-Length': size?.toString() || '1000'
		}
	});
}

export async function handleUploadEmoticon(client: Client, session: Session, filename: string, file: File): Promise<ApiMessageAttachment> {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
		try {
			let fileType = file.type;
			if (!fileType) {
				const fileNameParts = file.name.split('.');
				const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
				fileType = `text/${fileExtension}`;
			}

			const buf = await file?.arrayBuffer();

			resolve(uploadFile(client, session, filename, fileType, file.size, Buffer.from(buf)));
		} catch (error) {
			reject(new Error(`${error}`));
		}
	});
}
const mimeTypeMap: Record<string, string> = {
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
};

function getFileType(mimeType: string): string {
	return mimeTypeMap[mimeType] || mimeType;
}

async function getFileContentFromBlob(blobUrl: string) {
	try {
		const response = await fetch(blobUrl);
		if (!response.ok) {
			throw new Error(`Network response was not ok: ${response.statusText}`);
		}
		const blob = await response.blob();
		const text = await blob.text();
		return text;
	} catch (error) {
		return null;
	}
}

async function isEnvFileContent(blobUrl: string): Promise<boolean> {
	const fileContent = await getFileContentFromBlob(blobUrl);

	if (!fileContent) {
		return false;
	}

	const lines = fileContent.split('\n');
	for (let line of lines) {
		line = line.trim();
		if (line.includes('=') && !line.startsWith('#')) {
			return true;
		}
	}
	return false;
}

export async function handleUploadFile(
	client: Client,
	session: Session,
	currentClanId: string,
	currentChannelId: string,
	filename: string,
	file: CustomFile,
	index?: number
): Promise<ApiMessageAttachment> {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
		try {
			let fileType = file.type;
			if (!fileType) {
				const fileNameParts = file.name.split('.');
				const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
				fileType = `text/${fileExtension}`;
			}
			const shortFileType = getFileType(fileType);
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			let updatedFilename = filename;

			if (fileType === 'application/octet-stream') {
				const hasExtension = filename.includes('.');

				if (!hasExtension) {
					const isEnv = await isEnvFileContent(file.url ?? '');
					if (isEnv) {
						updatedFilename = `${filename}.env`;
					}
				}
			}
			const { filePath, originalFilename } = createUploadFilePath(session, currentClanId, currentChannelId, updatedFilename, false, index);
			const buf = await file?.arrayBuffer();

			resolve(
				uploadFile(client, session, filePath, shortFileType, file.size, Buffer.from(buf), false, originalFilename, file.width, file.height)
			);
		} catch (error) {
			reject(new Error(`${error}`));
		}
	});
}

export async function handleUploadFileMobile(
	client: Client,
	session: Session,
	currentClanId: string,
	currentChannelId: string,
	filename: string,
	file: any
): Promise<ApiMessageAttachment> {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
		try {
			let fileType = file.type;
			if (!fileType) {
				const fileNameParts = file.name.split('.');
				const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
				fileType = `text/${fileExtension}`;
			}
			if (file?.uri) {
				const arrayBuffer = BufferMobile.from(file.fileData, 'base64');
				if (!arrayBuffer) {
					console.error('Failed to read file data.');
					return;
				}
				const { filePath, originalFilename } = createUploadFilePath(session, currentClanId, currentChannelId, filename, true);
				resolve(uploadFile(client, session, filePath, fileType, file.size, arrayBuffer, true, originalFilename, file?.width, file?.height));
			}
		} catch (error) {
			reject(new Error(`${error}`));
		}
	});
}

export function createUploadFilePath(
	session: Session,
	currentClanId: string,
	currentChannelId: string,
	filename: string,
	isMobile: boolean,
	index?: number
): { filePath: string; originalFilename: string } {
	const originalFilename = filename;
	// Append milliseconds timestamp to filename
	const ms = new Date().getMilliseconds();
	filename = isMobile ? ms + filename : ms + '_' + index + filename;
	filename = filename.replace(/[^a-zA-Z0-9.]/g, '_');
	// Ensure valid clan and channel IDs
	if (!currentClanId) {
		currentClanId = '0';
	}
	if (!currentChannelId) {
		currentChannelId = '0';
	}
	const filePath = `${currentClanId}/${currentChannelId}/${session.user_id}/${filename}`;
	return { filePath, originalFilename };
}

export async function uploadFile(
	client: Client,
	session: Session,
	filename: string,
	type: string,
	size: number,
	buf: Buffer,
	isMobile?: boolean,
	originalFilename?: string,
	width?: number,
	height?: number
): Promise<ApiMessageAttachment> {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
		try {
			const data = await client.uploadAttachmentFile(session, {
				filename: filename,
				filetype: type,
				size: size,
				width,
				height
			});
			if (!data?.url) {
				reject(new Error('Failed to upload file. URL not available.'));
				return;
			}
			const res = await (isMobile ? uploadImageToMinIOMobile(data.url || '', buf, type, size) : uploadImageToMinIO(data.url || '', buf, size));
			if (res.status !== 200) {
				throw new Error('Failed to upload file to MinIO.');
			}
			const url = 'https://cdn.mezon.vn/' + filename;
			resolve({
				filename: originalFilename,
				url: url,
				filetype: type,
				size: size,
				width,
				height
			});
		} catch (error) {
			reject(new Error(`${error}`));
		}
	});
}
