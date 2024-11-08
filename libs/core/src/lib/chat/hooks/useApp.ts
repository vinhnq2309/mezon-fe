import { appActions, selectIsShowMemberList, selectTheme, useAppDispatch } from '@mezon/store';
import { useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useApp() {
	const dispatch = useAppDispatch();
	const isShowMemberList = useSelector(selectIsShowMemberList);
	// TODO: separate theme into a separate hook
	const appearanceTheme = useSelector(selectTheme);
	const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)');

	const setAppearanceTheme = useCallback(
		(value: string) => {
			dispatch(appActions.setTheme(value));
		},
		[dispatch]
	);

	const setIsShowMemberList = useCallback(
		(value: boolean) => {
			dispatch(appActions.setIsShowMemberList(value));
		},
		[dispatch]
	);

	useEffect(() => {
		switch (appearanceTheme) {
			case undefined:
				setAppearanceTheme('dark');
				break;
			case 'dark':
				document.documentElement.classList.add('dark');
				break;
			case 'light':
				document.documentElement.classList.remove('dark');
				break;
			default:
				break;
		}
	}, [appearanceTheme]);

	return useMemo(
		() => ({
			isShowMemberList,
			setIsShowMemberList,
			setAppearanceTheme,
			systemIsDark
		}),
		[isShowMemberList, setIsShowMemberList, setAppearanceTheme, systemIsDark]
	);
}
