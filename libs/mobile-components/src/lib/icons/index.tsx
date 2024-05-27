import Svg, { Circle, G, Path, Rect, SvgProps } from 'react-native-svg';

export function OnlineStatus() {
	return (
		<Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
			<Circle cx="6" cy="6" r="6" fill="#16A34A" />
		</Svg>
	);
}

export function OfflineStatus() {
	return (
		<Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
			<Rect x="1.5" y="1.5" width="9" height="9" rx="4.5" stroke="#AEAEAE" strokeWidth="3" />
		</Svg>
	);
}

export function SmilingFaceIcon({ width = 60, height = 60, color = "white", ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60">
			<Path
				d="M30 5C16.192 5 5 16.192 5 30c0 13.805 11.192 25 25 25 13.807 0 25-11.195 25-25C55 16.192 43.807 5 30 5zM20 15a5 5 0 110 10 5 5 0 010-10zm25 20c0 6.542-7.15 12.5-15 12.5S15 41.542 15 35v-2.5h30V35zm-5-10a5 5 0 110-10 5 5 0 010 10z"
				fill={color}
			/>
		</Svg>
	);
}

export function PlusIcon({ width = 60, height = 60 }) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60" fill="none">
			<Path d="M50 28.261H32.221V10.483h-4.445v17.778H10v4.445h17.777v17.777h4.445V32.706h17.777V28.26z" fill="#c7c7c7" />
		</Svg>
	);
}

export function HashSignIcon({ width = 60, height = 60 }) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60" fill="none">
			<Path d="M15.085 52.672C14.3072 52.672 13.7183 51.9669 13.8542 51.1986L15.3686 42.6383H6.8563C6.07975 42.6383 5.49115 41.9354 5.625 41.1678L6.0625 38.6594C6.16718 38.0593 6.68658 37.6214 7.2938 37.6214H16.2436L18.8936 22.5707H10.3813C9.60476 22.5707 9.01616 21.8678 9.15001 21.1003L9.58751 18.5918C9.69218 17.9917 10.2116 17.5538 10.8188 17.5538H19.7686L21.3605 8.55505C21.4664 7.95626 21.9851 7.52002 22.5912 7.52002H25.0521C25.8298 7.52002 26.4188 8.22507 26.2828 8.99343L24.7686 17.5538H39.7686L41.3605 8.55505C41.4663 7.95626 41.9851 7.52002 42.5913 7.52002H45.0521C45.8298 7.52002 46.4188 8.22507 46.2828 8.99343L44.7686 17.5538H53.2808C54.0573 17.5538 54.6461 18.2567 54.5121 19.0242L54.0746 21.5327C53.9701 22.1328 53.4506 22.5707 52.8433 22.5707H43.8936L41.2436 37.6214H49.7558C50.5323 37.6214 51.1211 38.3242 50.9871 39.0918L50.5496 41.6003C50.4451 42.2003 49.9256 42.6383 49.3183 42.6383H40.3685L38.7766 51.6371C38.6708 52.2358 38.1521 52.672 37.5458 52.672H35.085C34.3073 52.672 33.7183 51.9669 33.8543 51.1986L35.3685 42.6383H20.3686L18.7767 51.6371C18.6707 52.2358 18.152 52.672 17.5459 52.672H15.085ZM23.8947 22.5707L21.2447 37.6214H36.2445L38.8946 22.5707H23.8947Z" fill="#ffffff" />
		</Svg>

	)
}

export function CrossIcon({ width = 60, height = 60 }) {
	return (
		<Svg viewBox="0 0 20 20" width={height} height={width} fill="white">
			<G id="Live area">
				<Path id="Vector" d="M2.29289 16.2929C1.90237 16.6834 1.90237 17.3166 2.29289 17.7071C2.68342 18.0976 3.31658 18.0976 3.70711 17.7071L10 11.4142L16.2929 17.7071C16.6834 18.0976 17.3166 18.0976 17.7071 17.7071C18.0976 17.3166 18.0976 16.6834 17.7071 16.2929L11.4142 10L17.7071 3.70711C18.0976 3.31658 18.0976 2.68342 17.7071 2.29289C17.3166 1.90237 16.6834 1.90237 16.2929 2.29289L10 8.58579L3.70711 2.2929C3.31658 1.90237 2.68342 1.90237 2.29289 2.2929C1.90237 2.68342 1.90237 3.31658 2.29289 3.70711L8.58579 10L2.29289 16.2929Z">
				</Path>
			</G>
		</Svg>
	)
}

export function SearchIcon({ width = 60, height = 60, ...props }: SvgProps) {
	return (
		<Svg width={height} height={width} viewBox="0 0 60 60" fill="none" {...props}>
			<Path d="M54.2675 51.1217L40.785 37.6392C43.5075 34.1492 45 29.8867 45 25.3892C45 20.0467 42.9175 15.0242 39.14 11.2492C35.365 7.46916 30.3425 5.38916 25 5.38916C19.6575 5.38916 14.635 7.46916 10.86 11.2492C7.0825 15.0242 5 20.0467 5 25.3892C5 30.7317 7.0825 35.7542 10.86 39.5292C14.635 43.3092 19.6575 45.3892 25 45.3892C29.4975 45.3892 33.76 43.8992 37.25 41.1742L50.7325 54.6542L54.2675 51.1217ZM25 40.3892C20.9925 40.3892 17.2275 38.8292 14.395 35.9967C11.56 33.1642 10 29.3967 10 25.3892C10 21.3842 11.56 17.6167 14.395 14.7842C17.2275 11.9492 20.9925 10.3892 25 10.3892C29.0075 10.3892 32.7725 11.9492 35.605 14.7842C38.44 17.6167 40 21.3842 40 25.3892C40 29.3967 38.44 33.1642 35.605 35.9967C32.7725 38.8292 29.0075 40.3892 25 40.3892Z" fill="#FFFFFF" />
		</Svg>

	)
}

export function ThreadIcon({ width = 60, height = 60 }) {
	return (
		<Svg x="0" y="0" height={height} width={width} role="img" fill="#FFFFFF" viewBox="0 0 24 24">
			<Path d="M12 2.81a1 1 0 0 1 0-1.41l.36-.36a1 1 0 0 1 1.41 0l9.2 9.2a1 1 0 0 1 0 1.4l-.7.7a1 1 0 0 1-1.3.13l-9.54-6.72a1 1 0 0 1-.08-1.58l1-1L12 2.8ZM12 21.2a1 1 0 0 1 0 1.41l-.35.35a1 1 0 0 1-1.41 0l-9.2-9.19a1 1 0 0 1 0-1.41l.7-.7a1 1 0 0 1 1.3-.12l9.54 6.72a1 1 0 0 1 .07 1.58l-1 1 .35.36ZM15.66 16.8a1 1 0 0 1-1.38.28l-8.49-5.66A1 1 0 1 1 6.9 9.76l8.49 5.65a1 1 0 0 1 .27 1.39ZM17.1 14.25a1 1 0 1 0 1.11-1.66L9.73 6.93a1 1 0 0 0-1.11 1.66l8.49 5.66Z" fill="#FFFFFF"></Path>
		</Svg>
	)
}

export function MuteIcon({ width = 60, height = 60 }) {
	return (
		<Svg x="0" y="0" role="img" width={width} height={height} fill="white" viewBox="0 0 24 24">
			<Path fill="white" d="M1.3 21.3a1 1 0 1 0 1.4 1.4l20-20a1 1 0 0 0-1.4-1.4l-20 20ZM3.13 16.13c.11.27.46.28.66.08L15.73 4.27a.47.47 0 0 0-.07-.74 6.97 6.97 0 0 0-1.35-.64.62.62 0 0 1-.38-.43 2 2 0 0 0-3.86 0 .62.62 0 0 1-.38.43A7 7 0 0 0 5 9.5v2.09a.5.5 0 0 1-.13.33l-1.1 1.22A3 3 0 0 0 3 15.15v.28c0 .24.04.48.13.7ZM18.64 9.36c.13-.13.36-.05.36.14v2.09c0 .12.05.24.13.33l1.1 1.22a3 3 0 0 1 .77 2.01v.28c0 .67-.34 1.29-.95 1.56-1.31.6-4 1.51-8.05 1.51-.46 0-.9-.01-1.33-.03a.48.48 0 0 1-.3-.83l8.27-8.28ZM9.18 19.84A.16.16 0 0 0 9 20a3 3 0 1 0 6 0c0-.1-.09-.17-.18-.16a24.84 24.84 0 0 1-5.64 0Z">
			</Path>
		</Svg>

	)
}

export function SettingIcon({ width = 60, height = 60, color='white', ...props }: SvgProps) {
	return (
		<Svg fill='none' color={color} role="img" width={width} height={height} viewBox="0 0 24 24" {...props}>
			<Path fill="currentColor" fill-rule="evenodd" d="M10.56 1.1c-.46.05-.7.53-.64.98.18 1.16-.19 2.2-.98 2.53-.8.33-1.79-.15-2.49-1.1-.27-.36-.78-.52-1.14-.24-.77.59-1.45 1.27-2.04 2.04-.28.36-.12.87.24 1.14.96.7 1.43 1.7 1.1 2.49-.33.8-1.37 1.16-2.53.98-.45-.07-.93.18-.99.64a11.1 11.1 0 0 0 0 2.88c.06.46.54.7.99.64 1.16-.18 2.2.19 2.53.98.33.8-.14 1.79-1.1 2.49-.36.27-.52.78-.24 1.14.59.77 1.27 1.45 2.04 2.04.36.28.87.12 1.14-.24.7-.95 1.7-1.43 2.49-1.1.8.33 1.16 1.37.98 2.53-.07.45.18.93.64.99a11.1 11.1 0 0 0 2.88 0c.46-.06.7-.54.64-.99-.18-1.16.19-2.2.98-2.53.8-.33 1.79.14 2.49 1.1.27.36.78.52 1.14.24.77-.59 1.45-1.27 2.04-2.04.28-.36.12-.87-.24-1.14-.96-.7-1.43-1.7-1.1-2.49.33-.8 1.37-1.16 2.53-.98.45.07.93-.18.99-.64a11.1 11.1 0 0 0 0-2.88c-.06-.46-.54-.7-.99-.64-1.16.18-2.2-.19-2.53-.98-.33-.8.14-1.79 1.1-2.49.36-.27.52-.78.24-1.14a11.07 11.07 0 0 0-2.04-2.04c-.36-.28-.87-.12-1.14.24-.7.96-1.7 1.43-2.49 1.1-.8-.33-1.16-1.37-.98-2.53.07-.45-.18-.93-.64-.99a11.1 11.1 0 0 0-2.88 0ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clip-rule="evenodd"></Path>
		</Svg>

	)
}

export function AngleRightIcon({ width = 60, height = 60, ...props }: SvgProps) {
	return (
		<Svg fill="#c7c7c7" width={width} height={height} viewBox="-12 0 32 32" {...props}>
			<Path d="M0.88 23.28c-0.2 0-0.44-0.080-0.6-0.24-0.32-0.32-0.32-0.84 0-1.2l5.76-5.84-5.8-5.84c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l6.44 6.44c0.16 0.16 0.24 0.36 0.24 0.6s-0.080 0.44-0.24 0.6l-6.4 6.44c-0.2 0.16-0.4 0.24-0.6 0.24z"></Path>
		</Svg>

	)
}

export function AddMemberIcon({ width = 60, height = 60, ...props }: SvgProps) {
	return (
		<Svg role="img" width={width} height={height} fill="none" viewBox="0 0 24 24" {...props}>
			<Path d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" fill="white"></Path>
			<Path d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="white"></Path>
		</Svg>
	)
}

export function GiftIcon({ width = 60, height = 60, ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60" fill="none" {...props}>
			<Path fillRule="evenodd" clipRule="evenodd" d="M42.2201 20.6143H50.0051C52.7651 20.6143 55.0051 22.8719 55.0051 25.6479V30.6814H5.00513V25.6479C5.00513 22.8719 7.24763 20.6143 10.0051 20.6143H17.7901C16.6626 20.0229 15.5951 19.3005 14.7026 18.4046C11.7776 15.4599 11.7776 10.6705 14.7026 7.72841C17.5351 4.8769 22.4701 4.8769 25.3076 7.72338C29.4001 11.8433 29.9526 19.5975 30.0001 20.4683C30.0029 20.4973 29.9966 20.5232 29.9904 20.549C29.9851 20.5703 29.9801 20.5915 29.9801 20.6143H30.0301C30.0301 20.5913 30.0249 20.5699 30.0196 20.5485L30.0191 20.5462C30.0132 20.5217 30.0074 20.4973 30.0101 20.4709C30.0601 19.6 30.6101 11.8459 34.7026 7.72589C37.5401 4.87438 42.4701 4.8769 45.3076 7.72338C48.2301 10.673 48.2301 15.4625 45.3076 18.4046C44.4151 19.3005 43.3476 20.0229 42.2201 20.6143ZM35.4401 17.6571C35.9026 15.4348 36.7601 12.772 38.2376 11.2871C38.7076 10.8089 39.3351 10.5497 40.0051 10.5497C40.6751 10.5497 41.3026 10.8089 41.7701 11.2821C42.7451 12.2662 42.7476 13.8618 41.7726 14.8459C40.2951 16.3333 37.6476 17.199 35.4401 17.6571ZM7.50513 35.715V50.8156C7.50513 53.5916 9.74762 55.8492 12.5051 55.8492H27.5051V35.715H7.50513ZM32.5051 35.715V55.8492H47.5051C50.2651 55.8492 52.5051 53.5916 52.5051 50.8156V35.715H32.5051ZM18.2376 11.2846C17.2626 12.2662 17.2626 13.8618 18.2376 14.8459C19.7026 16.3207 22.3676 17.1915 24.5676 17.6521C24.1076 15.4323 23.2476 12.7695 21.7726 11.2846C21.3026 10.8089 20.6751 10.5497 20.0051 10.5497C19.3351 10.5497 18.7076 10.8089 18.2376 11.2846Z" fill="#c7c7c7" />
		</Svg>
	)
}

export function MicrophoneIcon({ width = 60, height = 60, ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} viewBox="0 0 36 50" fill="none" {...props}>
			<Path fillRule="evenodd" clipRule="evenodd" d="M31.25 22.5C31.25 30 24.9 35.25 18 35.25C11.1 35.25 4.75 30 4.75 22.5H0.5C0.5 31.025 7.3 38.075 15.5 39.3V50H20.5V39.3C28.7 38.1 35.5 31.05 35.5 22.5H31.25Z" fill="#c7c7c7" />
			<Path d="M25.475 22.5C25.475 26.65 22.15 30 18 30C13.85 30 10.5 26.65 10.5 22.5V7.5C10.5 3.35 13.85 0 18 0C22.15 0 25.5 3.35 25.5 7.5L25.475 22.5Z" fill="#c7c7c7" />
		</Svg>
	)
}

export function SendIcon({ width = 60, height = 60, ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} viewBox="0 0 60 60" fill="none" {...props}>
			<Path d="M31.0268 32.3299L7.49989 34.6045L1.30886 54.4046C0.939715 55.5753 1.30183 56.8548 2.23343 57.6566C3.16151 58.458 4.4799 58.6267 5.58386 58.089L57.144 33.1211C58.1531 32.6289 58.7929 31.6058 58.7929 30.4843C58.7929 29.3629 58.1528 28.3398 57.144 27.8476L5.61896 2.86181C4.51504 2.32392 3.1967 2.49267 2.26853 3.29424C1.33685 4.09581 0.974778 5.37198 1.34396 6.54269L7.53495 26.3427L31.016 28.6208C31.9652 28.7157 32.6894 29.5138 32.6894 30.4665C32.6894 31.4193 31.9652 32.2173 31.016 32.3122L31.0268 32.3299Z" fill="white" />
		</Svg>
	)
}
export function ReplyIcon({ width = 20, height = 20, ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			viewBox="0 0 32 10"
			fill="none"
			{...props}
		>
			<Path d="M1 9V6a5 5 0 015-5h25" stroke="#535353" />
		</Svg>
	)
}

export function TrashIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 448 512" {...props}>
			<Path fill={color} d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64s14.3 32 32 32h384c17.7 0 32-14.3 32-32s-14.3-32-32-32h-96l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32l21.2 339c1.6 25.3 22.6 45 47.9 45h245.8c25.3 0 46.3-19.7 47.9-45L416 128z" />
		</Svg>
	)
}

export function CopyIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 448 512" {...props}>
			<Path fill={color} d="M320 448v40c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V120c0-13.3 10.7-24 24-24h72v296c0 30.9 25.1 56 56 56h168zm0-344V0H152c-13.3 0-24 10.7-24 24v368c0 13.3 10.7 24 24 24h272c13.3 0 24-10.7 24-24V128H344c-13.2 0-24-10.8-24-24zm121-31L375 7a24 24 0 00-16.9-7H352v96h96v-6.1a24 24 0 00-7-17z" />
		</Svg>
	)
}

export function LinkIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 512 512" {...props}>
			<Path fill={color} d="M326.6 185.4c59.7 59.8 58.9 155.7.4 214.6-.1.1-.2.3-.4.4l-67.2 67.2c-59.3 59.3-155.7 59.3-215 0-59.3-59.3-59.3-155.7 0-215l37.1-37.1c9.8-9.8 26.8-3.3 27.3 10.6.6 17.7 3.8 35.5 9.7 52.7 2 5.8.6 12.3-3.8 16.6l-13.1 13.1c-28 28-28.9 73.7-1.2 102 28 28.6 74.1 28.7 102.3.5l67.2-67.2c28.2-28.2 28.1-73.8 0-101.8-3.7-3.7-7.4-6.6-10.3-8.6a16 16 0 01-6.9-12.6c-.4-10.6 3.3-21.5 11.7-29.8l21.1-21.1c5.5-5.5 14.2-6.2 20.6-1.7a152.5 152.5 0 0120.5 17.2zm140.9-141c-59.3-59.3-155.7-59.3-215 0l-67.2 67.2-.4.4c-58.6 58.9-59.4 154.8.4 214.6a152.5 152.5 0 0020.5 17.2c6.4 4.5 15.1 3.8 20.6-1.7l21.1-21.1c8.4-8.4 12.1-19.2 11.7-29.8a16 16 0 00-6.9-12.6c-2.9-2-6.6-4.9-10.3-8.6-28.1-28.1-28.2-73.6 0-101.8l67.2-67.2c28.2-28.2 74.3-28.1 102.3.5 27.8 28.3 26.9 73.9-1.2 102l-13.1 13.1c-4.4 4.4-5.8 10.8-3.8 16.6 5.9 17.2 9 35 9.7 52.7.5 13.9 17.5 20.4 27.3 10.6l37.1-37.1c59.3-59.3 59.3-155.7 0-215z" />
		</Svg>
	)
}

export function MentionIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 512 512" {...props}>
			<Path fill={color} d="M256 64C150 64 64 150 64 256s86 192 192 192c17.7 0 32 14.3 32 32s-14.3 32-32 32C114.6 512 0 397.4 0 256S114.6 0 256 0s256 114.6 256 256v32c0 53-43 96-96 96-29.3 0-55.6-13.2-73.2-33.9-22.8 21-53.3 33.9-86.8 33.9-70.7 0-128-57.3-128-128s57.3-128 128-128c27.9 0 53.7 8.9 74.7 24.1 5.7-5 13.1-8.1 21.3-8.1 17.7 0 32 14.3 32 32v112c0 17.7 14.3 32 32 32s32-14.3 32-32v-32c0-106-86-192-192-192zm64 192a64 64 0 10-128 0 64 64 0 10128 0z" />
		</Svg>
	)
}

export function HashtagIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 448 512" {...props}>
			<Path fill={color} d="M181.3 32.4c17.4 2.9 29.2 19.4 26.3 36.8l-9.8 58.8h95.1l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3s29.2 19.4 26.3 36.8l-9.7 58.8H416c17.7 0 32 14.3 32 32s-14.3 32-32 32h-68.9l-21.3 128H384c17.7 0 32 14.3 32 32s-14.3 32-32 32h-68.9l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.8-58.7h-95.2l-11.5 69.3c-2.9 17.4-19.4 29.2-36.8 26.3s-29.2-19.4-26.3-36.8l9.7-58.9H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l21.3-128H64c-17.7 0-32-14.3-32-32s14.3-32 32-32h68.9l11.5-69.3c2.9-17.4 19.4-29.2 36.8-26.3zm5.8 159.6l-21.3 128h95.1l21.3-128h-95.1z" />
		</Svg>
	)
}

export function PinMessageIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 384 512" {...props}>
			<Path fill={color} d="M298 214.3L285.8 96H328c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24H56C42.7 0 32 10.7 32 24v48c0 13.3 10.7 24 24 24h42.2L86 214.3C37.5 236.8 0 277.3 0 328c0 13.3 10.7 24 24 24h136v104c0 1.2.3 2.5.8 3.6l24 48c2.9 5.9 11.4 5.9 14.3 0l24-48a8 8 0 00.8-3.6V352h136c13.3 0 24-10.7 24-24 0-51.2-38-91.4-86-113.7z" />
		</Svg>
	)
}

export function MarkUnreadIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 640 512" {...props}>
			<Path fill={color} d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2s-6.3 25.5 4.1 33.7l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7l-117.9-92.4C552.2 340.2 576 292.3 576 240c0-114.9-114.6-208-256-208-67.7 0-129.3 21.4-175.1 56.3L38.8 5.1zm385.2 425L82.9 161.3C70.7 185.6 64 212.2 64 240c0 45.1 17.7 86.8 47.7 120.9-1.9 24.5-11.4 46.3-21.4 62.9-5.5 9.2-11.1 16.6-15.2 21.6-2.1 2.5-3.7 4.4-4.9 5.7-.6.6-1 1.1-1.3 1.4l-.3.3c-4.6 4.6-5.9 11.4-3.4 17.4 2.5 6 8.3 9.9 14.8 9.9 28.7 0 57.6-8.9 81.6-19.3 22.9-10 42.4-21.9 54.3-30.6 31.8 11.5 67 17.9 104.1 17.9 37 0 72.3-6.4 104.1-17.9z" />
		</Svg>
	)
}

export function PenIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 512 512" {...props}>
			<Path fill={color} d="M362.7 19.3l-48.4 48.4 130 130 48.4-48.4c25-25 25-65.5 0-90.5l-39.4-39.5c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2c-2.5 8.5-.2 17.6 6 23.8s15.3 8.5 23.7 6.1L151 475.7c14.1-4.2 27-11.8 37.4-22.2l233.3-233.2-130-130z" />
		</Svg>
	)
}

export function FlagIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 448 512" {...props}>
			<Path fill={color} d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32v448c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4 44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
		</Svg>
	)
}

export function ReplyMessageIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 512 512" {...props}>
			<Path fill={color} d="M205 34.8c11.5 5.1 19 16.6 19 29.2v64h112c97.2 0 176 78.8 176 176 0 113.3-81.5 163.9-100.2 174.1-2.5 1.4-5.3 1.9-8.1 1.9-10.9 0-19.7-8.9-19.7-19.7 0-7.5 4.3-14.4 9.8-19.5 9.4-8.8 22.2-26.4 22.2-56.7 0-53-43-96-96-96h-96v64c0 12.6-7.4 24.1-19 29.2s-25 3-34.4-5.4l-160-144C3.9 225.7 0 217.1 0 208s3.9-17.7 10.6-23.8l160-144c9.4-8.5 22.9-10.6 34.4-5.4z" />
		</Svg>
	)
}

export function FaceIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 512 512" {...props}>
			<Path fill={color} d="M256 512a256 256 0 100-512 256 256 0 100 512zM96.8 314.1c-3.8-13.7 7.4-26.1 21.6-26.1h275.2c14.2 0 25.5 12.4 21.6 26.1C396.2 382 332.1 432 256 432S115.8 382 96.8 314.1zM144.4 192a32 32 0 1164 0 32 32 0 11-64 0zm192-32a32 32 0 110 64 32 32 0 110-64z" />
		</Svg>
	)
}

export function LogoutIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg viewBox="0 0 512 512" {...props}>
			<Path fill={color} d="M377.9 105.9l122.8 122.8c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9-18.7 0-33.9-15.2-33.9-33.9V320H192c-17.7 0-32-14.3-32-32v-64c0-17.7 14.3-32 32-32h128v-62.1c0-18.7 15.2-33.9 33.9-33.9 9 0 17.6 3.6 24 9.9zM160 96H96c-17.7 0-32 14.3-32 32v256c0 17.7 14.3 32 32 32h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-53 0-96-43-96-96V128c0-53 43-96 96-96h64c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
		</Svg>
	)
}

export function PollIcon({ width = 16, height = 16, color = 'white', ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} fill={color} viewBox="0 0 512 512" {...props}>
			<Path d="M40 48c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zm152 16c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32h288c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zm24 136c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24h48c13.3 0 24-10.7 24-24v-48c0-13.3-10.7-24-24-24H40z" />
		</Svg>
	)
}

export function FilesIcon({ width = 16, height = 16, color = 'white', ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} fill={color} viewBox="0 0 512 512" {...props}>
			<Path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
		</Svg>
	)
}

export function CameraIcon({ width = 16, height = 16, color = 'white', ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} fill={color} viewBox="0 0 512 512" {...props}>
			<Path d="M149.1 64.8L138.7 96H64c-35.3 0-64 28.7-64 64v256c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64h-74.7l-10.4-31.2C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 110 192 96 96 0 110-192z" />
		</Svg>
	)
}

export function PlayIcon({ width = 16, height = 16, color = 'white', ...props }: SvgProps) {
	return (
		<Svg width={width} height={height} fill={color} viewBox="0 0 512 512" {...props}>
			<Path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80v352c0 17.4 9.4 33.4 24.5 41.9S58.2 482 73 473l288-176c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
		</Svg>
	)
}
export function CloseIcon({ width = 16, height = 16, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
			<Path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z" />
		</Svg>
	)
}
export function CheckIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 448 512"
			{...props}
		>
			<Path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7l233.4-233.3c12.5-12.5 32.8-12.5 45.3 0z" />
		</Svg>
	)
}

export function FileIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
			<Path d="M0 64C0 28.7 28.7 0 64 0h160v128c0 17.7 14.3 32 32 32h128v288c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0l128 128z" />
		</Svg>
	)
}

export function UserPlusIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
			<Path d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
		</Svg>
	)
}

export function MessageIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
			<Path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z" />
		</Svg>
	)
}

export function CallIcon({ width = 20, height = 20, color='white' , ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
		<Path d="M280 0c128.1 0 232 103.9 232 232 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 110 64 32 32 0 110-64zm-32-72c0-13.3 10.7-24 24-24 75.1 0 136 60.9 136 136 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7l40.3-49.3c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512 200.6 512 0 311.4 0 64c0-18 12.1-33.8 29.5-38.6l88-24z" />
	  </Svg>
	)
}

export function ChevronIcon({ width = 20, height = 20, color='white' , ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
		<Path d="M285.5 273L91.1 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.7-22.7c-9.4-9.4-9.4-24.5 0-33.9l154-154.7-154-154.7c-9.3-9.4-9.3-24.5 0-33.9l22.7-22.7c9.4-9.4 24.6-9.4 33.9 0L285.5 239c9.4 9.4 9.4 24.6 0 33.9z" />
	  </Svg>
	)
}

export function PaperPlaneIcon({ width = 20, height = 20, color='white' , ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
		<Path d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z" />
		</Svg>
	)
}

export function ArrowDownIcon({ width = 20, height = 20, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			width={width}
			height={height}
			fill={color}
			viewBox="0 0 384 512"
			{...props}
		>
			<Path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
		</Svg>
	)
}

export function MemberListIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			x="0"
			y="0"
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				d="M14.5 8a3 3 0 1 0-2.7-4.3c-.2.4.06.86.44 1.12a5 5 0 0 1 2.14 3.08c.01.06.06.1.12.1ZM18.44 17.27c.15.43.54.73 1 .73h1.06c.83 0 1.5-.67 1.5-1.5a7.5 7.5 0 0 0-6.5-7.43c-.55-.08-.99.38-1.1.92-.06.3-.15.6-.26.87-.23.58-.05 1.3.47 1.63a9.53 9.53 0 0 1 3.83 4.78ZM12.5 9a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM2 20.5a7.5 7.5 0 0 1 15 0c0 .83-.67 1.5-1.5 1.5a.2.2 0 0 1-.2-.16c-.2-.96-.56-1.87-.88-2.54-.1-.23-.42-.15-.42.1v2.1a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2.1c0-.25-.31-.33-.42-.1-.32.67-.67 1.58-.88 2.54a.2.2 0 0 1-.2.16A1.5 1.5 0 0 1 2 20.5Z"
			></Path>
		</Svg>
	)
}

export function GameControllerIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fillRule="evenodd"
				d="M20.97 4.06c0 .18.08.35.24.43.55.28.9.82 1.04 1.42.3 1.24.75 3.7.75 7.09v4.91a3.09 3.09 0 0 1-5.85 1.38l-1.76-3.51a1.09 1.09 0 0 0-1.23-.55c-.57.13-1.36.27-2.16.27s-1.6-.14-2.16-.27c-.49-.11-1 .1-1.23.55l-1.76 3.51A3.09 3.09 0 0 1 1 17.91V13c0-3.38.46-5.85.75-7.1.15-.6.49-1.13 1.04-1.4a.47.47 0 0 0 .24-.44c0-.7.48-1.32 1.2-1.47l2.93-.62c.5-.1 1 .06 1.36.4.35.34.78.71 1.28.68a42.4 42.4 0 0 1 4.4 0c.5.03.93-.34 1.28-.69.35-.33.86-.5 1.36-.39l2.94.62c.7.15 1.19.78 1.19 1.47ZM20 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM15.5 12a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM5 7a1 1 0 0 1 2 0v1h1a1 1 0 0 1 0 2H7v1a1 1 0 1 1-2 0v-1H4a1 1 0 1 1 0-2h1V7Z"
				clipRule="evenodd"
				fill={color}
			></Path>
		</Svg>
	)
}

export function HeartIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				d="M12.47 21.73a.92.92 0 0 1-.94 0C9.43 20.48 1 15.09 1 8.75A5.75 5.75 0 0 1 6.75 3c2.34 0 3.88.9 5.25 2.26A6.98 6.98 0 0 1 17.25 3 5.75 5.75 0 0 1 23 8.75c0 6.34-8.42 11.73-10.53 12.98Z"
			></Path>
		</Svg>
	)
}

export function ObjectIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				d="M10.41 3.59 11.6 2.4a2 2 0 0 1 2.82 0l1.3 1.3a1 1 0 0 0 .7.29h4.18a1.41 1.41 0 0 1 1 2.41L14.4 13.6a1.41 1.41 0 0 1-2.41-1V8.4l-3.11 3.12a2 2 0 0 0-.53 1.87L9.9 20H15a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h4.86L6.4 13.86a4 4 0 0 1 1.06-3.75L10.8 6.8l-.38-.38a2 2 0 0 1 0-2.82Z"
			></Path>
			<Path
				fill={color}
				d="M16.99 12.43c-.21.2-.2.55.06.7a3 3 0 0 0 4.08-4.08c-.15-.26-.5-.27-.7-.06l-3.44 3.44Z"></Path>
		</Svg>
	)
}

export function LeafIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				d="M9.8 14.6c-.45.31-.9.6-1.37.89l-.02.01-1.15.73c-.85.57-1.68 1.2-2.4 2.1a7.75 7.75 0 0 0-.7 1.03c-.39.69-.7 1.48-.94 2.42a1 1 0 0 0 1.94.49c.12-.49.26-.9.42-1.28 1.98.08 9.05-.04 12.73-5.34 3.5-5.02 2.89-10.16 2.01-13.89-.19-.81-1.26-1-1.85-.42-1.8 1.8-3.69 2.32-5.67 2.86-2.34.63-4.8 1.3-7.35 4.15a9.13 9.13 0 0 0-2.13 8.7c.9-1.11 1.92-1.88 2.84-2.48.4-.28.8-.53 1.18-.76a13.7 13.7 0 0 0 3.55-2.83 1 1 0 1 1 1.52 1.3A13.44 13.44 0 0 1 9.8 14.6Z"
			></Path>
		</Svg>
	)
}

export function BicycleIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				fillRule="evenodd"
				d="M15 4a1 1 0 0 0-.95 1.32l.9 2.68h-4.6l-.92-2.36A1 1 0 0 0 8.5 5H5a1 1 0 0 0 0 2h2.82l.5 1.27a1 1 0 0 0-.2.26L6.7 11.16a4.5 4.5 0 1 0 1.76.95l.78-1.45 1.83 4.7a1 1 0 1 0 1.86-.72L11.13 10h4.48l.55 1.65a4.5 4.5 0 1 0 1.9-.63L16.4 6h1.86c.41 0 .75.34.75.75V7a1 1 0 1 0 2 0v-.25A2.75 2.75 0 0 0 18.25 4H15Zm-9.3 9-1.08 2.03a1 1 0 0 0 1.76.94l1.09-2.01A2.5 2.5 0 1 1 5.7 13Zm11.13.64.72 2.18a1 1 0 0 0 1.9-.64l-.73-2.17a2.5 2.5 0 1 1-1.9.63Z"
				clipRule="evenodd"
			></Path>
		</Svg>
	)
}

export function BowlIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				d="M7 1a1 1 0 0 0-1 1v.2c0 .79-.4 1.53-1.05 1.97A4.37 4.37 0 0 0 3 7.8V8a1 1 0 0 0 2 0v-.2c0-.79.4-1.53 1.05-1.97A4.37 4.37 0 0 0 8 2.2V2a1 1 0 0 0-1-1ZM10 3a1 1 0 1 1 2 0v.42a3.2 3.2 0 0 1-2.18 3.03A1.2 1.2 0 0 0 9 7.58V8a1 1 0 0 1-2 0v-.42c0-1.37.88-2.6 2.18-3.03.5-.16.82-.62.82-1.13V3ZM2 11a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1 10 10 0 0 1-4.7 8.49.6.6 0 0 0-.3.51 2 2 0 0 1-2 2H9a2 2 0 0 1-2-2 .6.6 0 0 0-.3-.51A10 10 0 0 1 2 11ZM20.85 8.02c.16.52-.3.98-.85.98h-8c-.55 0-1.01-.46-.85-.98a4.07 4.07 0 0 1 1.31-1.84 5.23 5.23 0 0 1 1.63-.88 6.1 6.1 0 0 1 3.82 0c.61.2 1.16.5 1.63.87a4.07 4.07 0 0 1 1.3 1.85Z"
			></Path>
		</Svg>
	)
}

export function RibbonIcon({ width = 24, height = 24, color = 'white', ...props }: SvgProps) {
	return (
		<Svg
			role="img"
			width={width}
			height={height}
			viewBox="0 0 24 24"
		>
			<Path
				fill={color}
				d="M3 1a1 1 0 0 1 1 1v.82l8.67-1.45A2 2 0 0 1 15 3.35v1.47l5.67-.95A2 2 0 0 1 23 5.85v7.3a2 2 0 0 1-1.67 1.98l-9 1.5a2 2 0 0 1-1.78-.6c-.2-.21-.08-.54.18-.68a5.01 5.01 0 0 0 1.94-1.94c.18-.32-.1-.66-.46-.6L4 14.18V21a1 1 0 1 1-2 0V2a1 1 0 0 1 1-1Z"
			></Path>
		</Svg>
	)
}
