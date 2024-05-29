import { Icons } from '@mezon/components';
import { useClans } from '@mezon/core';
import { selectCurrentChannelId, selectCurrentClanId } from '@mezon/store';
import { handleUploadFile, useMezon } from '@mezon/transport';
import { Button } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

type ClanLogoNameProps = {
	onUpload: (url: string) => void;
	onGetClanName: (clanName: string) => void;
	onHasChanges: (hasChanges: boolean) => void;
};

const ClanLogoName = ({ onUpload, onGetClanName, onHasChanges }: ClanLogoNameProps) => {
	const { sessionRef, clientRef } = useMezon();
	const { currentClan } = useClans();

	const currentClanId = useSelector(selectCurrentClanId) || '';
	const currentChannelId = useSelector(selectCurrentChannelId) || '';

	const [urlLogo, setUrlLogo] = useState<string>(currentClan?.logo ?? '');
	const [clanName, setClanName] = useState<string>(currentClan?.clan_name ?? '');
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFile = (e: any) => {
		const file = e?.target?.files[0];
		const session = sessionRef.current;
		const client = clientRef.current;

		if (!file) return;

		if (!client || !session) {
			throw new Error('Client or file is not initialized');
		}

		handleUploadFile(client, session, currentClanId, currentChannelId, file?.name, file).then((attachment: any) => {
			setUrlLogo(attachment.url ?? '');
			onUpload(attachment.url ?? '');
		});
	};

	const handleChangeClanName = (clanName: string) => {
		setClanName(clanName);
		onGetClanName(clanName);
	};

	const handleOpenFile = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleCloseFile = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		setUrlLogo('');
	};

	useEffect(() => {
		if (clanName !== currentClan?.clan_name || urlLogo !== currentClan?.logo) {
			onHasChanges(true);
		} else {
			onHasChanges(false);
		}
	}, [clanName, urlLogo]);

	return (
		<div className="flex sbm:flex-row flex-col gap-[10px]">
			<div className="flex flex-row flex-1 text-textSecondary gap-x-[10px]">
				<div className="flex flex-2 gap-x-[10px]">
					<div className="flex flex-col">
						<div className="relative flex items-center justify-center w-[100px] h-[100px] rounded-full shadow-lg shadow-neutral-800">
							<label className="w-full h-full">
								<div
									style={{ backgroundImage: `url(${urlLogo})` }}
									className={`flex items-center justify-center bg-cover bg-no-repeat bg-center w-[100px] h-[100px] bg-transparent rounded-full relative cursor-pointer`}
								>
									{!urlLogo && <span>{currentClan?.clan_name}</span>}
								</div>
								<input ref={fileInputRef} id="upload_logo" onChange={(e) => handleFile(e)} type="file" className="hidden" />
							</label>
							<button
								onClick={handleCloseFile}
								className="absolute top-0 right-0 w-7 h-7 rounded-full bg-[#A7A8AC] hover:bg-[#919193] flex items-center justify-center"
							>
								{true ? <Icons.Close /> : <Icons.ImageUploadIcon />}
							</button>
						</div>
						<p className="text-[10px] mt-[10px]">Minimum Size: 128x128</p>
					</div>
				</div>
				<div className="flex flex-3 flex-col ml-[10px]">
					<p className="text-sm mb-2">We recommend an image of at least 512x512 for the server.</p>
					<Button
						onClick={handleOpenFile}
						className="h-10 text-sm w-fit mt-2 rounded bg-transparent border border-buttonProfile hover:!bg-buttonProfileHover dark:bg-transparent dark:hover:!bg-buttonProfile focus:!ring-transparent"
					>
						Upload Image
					</Button>
				</div>
			</div>
			<div className="flex flex-1 flex-col">
				<h3 className="text-xs font-bold dark:text-textSecondary text-textSecondary800 uppercase mb-2">Server Name</h3>
				<div className="w-full">
					<input
						type="text"
						value={clanName}
						onChange={(e) => handleChangeClanName(e.target.value)}
						className="text-[#B5BAC1] outline-none w-full h-10 p-[10px] bg-[#26262B] text-base rounded placeholder:text-sm"
						placeholder="Support has arrived!"
					/>
				</div>
			</div>
		</div>
	);
};

export default ClanLogoName;
