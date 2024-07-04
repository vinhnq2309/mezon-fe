import { selectTheme } from '@mezon/store';
import { ContextMenuItem } from '@mezon/utils';
import { CSSProperties, useMemo, useState } from 'react';
import { Item, Menu, Separator, Submenu } from 'react-contexify';
// import 'react-contexify/dist/ReactContexify.css';
import { useSelector } from 'react-redux';
import ReactionPart from './ReactionPart';

type Props = {
	menuId: string;
	items: ContextMenuItem[];
	mode: number | undefined;
	messageId: string;
};

export default function DynamicContextMenu({ menuId, items, mode, messageId }: Props) {
	const appearanceTheme = useSelector(selectTheme);
	const emojiList = [':anhan:', , ':100:', ':rofl:', ':verify:'];
	const [warningStatus, setWarningStatus] = useState<string>('');

	const isLightMode = useMemo(() => {
		return appearanceTheme === 'light';
	}, [appearanceTheme]);

	const className: CSSProperties = {
		'--contexify-menu-bgColor': isLightMode ? '#FFFFFF' : '#111214',
		'--contexify-item-color': isLightMode ? '#4E5057' : '#ADB3B9',
		'--contexify-activeItem-color': '#FFFFFF',
		'--contexify-activeItem-bgColor': warningStatus,
		'--contexify-rightSlot-color': '#6f6e77',
		'--contexify-activeRightSlot-color': '#fff',
		'--contexify-arrow-color': '#6f6e77',
		'--contexify-activeArrow-color': '#fff',
		'--contexify-itemContent-padding': '3px',
		'--contexify-menu-radius': '2px',
		'--contexify-activeItem-radius': '2px',
		'--contexify-menu-minWidth': '188px',
		'--contexify-separator-color': '#ADB3B9',
	} as CSSProperties;

	const children = useMemo(() => {
		const elements: React.ReactNode[] = [];
		for (let index = 0; index < items.length; index++) {
			const item = items[index];
			const lableItemWarning =
				item.label === 'Delete Message' ||
				item.label === 'Report Message' ||
				item.label === 'Remove Reactions' ||
				item.label === 'Remove All Reactions';
			if (item.label === 'Copy Link' || item.label === 'Copy Image') elements.push(<Separator key={`separator-${index}`} />);
			elements.push(
				<Item
					key={item.label}
					onClick={item.handleItemClick}
					disabled={item.disabled}
					onMouseEnter={() => {
						if (lableItemWarning) {
							setWarningStatus('#E13542');
						} else {
							setWarningStatus('#4B5CD6');
						}
					}}
					onMouseLeave={() => {
						setWarningStatus('#4B5CD6');
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
							fontFamily: `'gg sans', 'Noto Sans', sans-serif`,
							fontSize: '14px',
							fontWeight: 500,
						}}
						className={`${lableItemWarning ? ' text-[#E13542] hover:text-[#FFFFFF]' : 'text-[#ADB3B9] hover:text-[#FFF]'} `}
					>
						<span>{item.label}</span>
						<span> {item.icon}</span>
					</div>
				</Item>,
			);

			if (item.hasSubmenu)
				elements.push(
					<Submenu label={item.label}>
						{item.subMenuItems?.map((subMenuItem) => (
							<Item key={subMenuItem.id} onClick={subMenuItem.handleItemClick} disabled={subMenuItem.disabled}>
								{subMenuItem.label}
							</Item>
						))}
					</Submenu>,
				);
		}
		return elements;
	}, [items]);

	return (
		<Menu id={menuId} style={className}>
			<ReactionPart emojiList={emojiList} activeMode={mode} messageId={messageId} />
			{children}
		</Menu>
	);
}
