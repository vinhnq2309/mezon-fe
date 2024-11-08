import { DetailedHTMLProps, ImgHTMLAttributes, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export type AvatarImageProp = {
	userName?: string;
	alt: string;
	isAnonymous?: boolean;
	classNameText?: string;
} & DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>;

export const AvatarImage = ({ userName, src, alt, className = '', isAnonymous, classNameText, ...rest }: AvatarImageProp) => {
	const [isError, setIsError] = useState(false);

	const computedClassName = twMerge('size-10 rounded-full object-cover min-w-5 min-h-5 cursor-pointer ' + className);
	const handleError = () => {
		setIsError(true);
	};

	if ((!src && !userName) || isAnonymous)
		return <img className={computedClassName} src="./assets/images/anonymous-avatar.jpg" alt={'anonymous-avatar'} {...rest} />;

	if (!src || isError) {
		const avatarChar = userName?.charAt(0)?.toUpperCase() || '';

		return (
			<div
				className={`size-10 dark:bg-bgAvatarDark bg-bgAvatarLight rounded-full flex justify-center items-center dark:text-bgAvatarLight text-bgAvatarDark text-[16px] ${className} ${classNameText}`}
			>
				{avatarChar}
			</div>
		);
	}

	return <img loading="lazy" onError={handleError} className={computedClassName} src={src} alt={alt} {...rest} />;
};
