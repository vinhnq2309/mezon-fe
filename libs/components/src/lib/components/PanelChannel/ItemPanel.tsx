import { Checkbox, Radio } from 'flowbite-react';
import * as Icons from '../Icons';

type ItemPanelProps = {
	children: string;
	dropdown?: string;
	type?: 'radio' | 'checkbox' | 'none';
	onClick?: () => void;
};

const ItemPanel = ({ children, dropdown, type, onClick }: ItemPanelProps) => {
	return (
		<button onClick={onClick} className="flex items-center w-full justify-between rounded-sm hover:bg-bgSelectItem hover:[&>*]:text-[#fff] pr-2">
			<li className="text-[14px] text-[#B5BAC1] font-medium w-full py-[6px] px-[8px] text-left cursor-pointer list-none ">{children}</li>
			{dropdown && <Icons.RightIcon defaultFill="#fff" />}
			{type === 'checkbox' && <Checkbox id="accept" defaultChecked />}
			{type === 'radio' && <Radio className="" value="change here" />}
		</button>
	);
};

export default ItemPanel;
