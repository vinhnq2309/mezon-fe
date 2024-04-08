import { ThunkDispatch } from '@reduxjs/toolkit';
import {
	gifsActions,
	selectAllgifs,
	selectGifsDataSearch,
	selectLoadingStatusGifs,
	selectValueInputSearch,
} from 'libs/store/src/lib/giftStickerEmojiPanel/gifs.slice';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useGifs() {
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
	const dataGifs = useSelector(selectAllgifs);
	const dataGifsSearch = useSelector(selectGifsDataSearch);
	const loadingStatusGifs = useSelector(selectLoadingStatusGifs);
	const valueInputToCheckHandleSearch = useSelector(selectValueInputSearch);

	const fetchGifsDataSearch = useCallback(
		(valueSearch: string) => {
			dispatch(gifsActions.fetchGifsDataSearch(valueSearch));
		},
		[dispatch],
	);

	const setValueInputSearch = useCallback(
		(valueSearch: string) => {
			dispatch(gifsActions.setValueInputSearch(valueSearch));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			fetchGifsDataSearch,
			dataGifs,
			dataGifsSearch,
			loadingStatusGifs,
			valueInputToCheckHandleSearch,
			setValueInputSearch,
		}),
		[dataGifs, fetchGifsDataSearch, dataGifsSearch, loadingStatusGifs, valueInputToCheckHandleSearch, setValueInputSearch],
	);
}
