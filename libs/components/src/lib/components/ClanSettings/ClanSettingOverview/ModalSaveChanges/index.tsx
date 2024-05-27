import { Button } from 'flowbite-react';

type ModalSaveChangesProps = {
	onSave: () => void;
};

const ModalSaveChanges = ({ onSave }: ModalSaveChangesProps) => {
	return (
		<div className="w-[700px] fixed bottom-[20px] left-[50%] translate-x-[-50%] py-[10px] pl-4 pr-[10px] rounded-[5px] bg-bgProfileBody">
			<div className="flex flex-row justify-between items-center">
				<h3 className="text-base font-medium">Careful — you have unsaved changes!</h3>
				<div className="flex flex-row justify-end gap-[10px]">
					<Button className="h-10 w-fit rounded bg-transparent border border-buttonProfile hover:!bg-buttonProfileHover dark:bg-transparent dark:hover:!bg-buttonProfile focus:!ring-transparent">
						Reset
					</Button>
					<Button
						onClick={onSave}
						className="h-10 w-fit rounded bg-bgSelectItem hover:!bg-bgSelectItemHover border border-buttonProfile dark:bg-bgSelectItem dark:hover:!bg-bgSelectItemHover focus:!ring-transparent"
					>
						Save Changes
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ModalSaveChanges;
