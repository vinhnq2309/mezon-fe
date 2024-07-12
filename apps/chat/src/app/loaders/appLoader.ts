import { AppDispatch, appActions, authActions } from '@mezon/store';
import { LoaderFunctionArgs } from 'react-router-dom';

export interface IAppLoaderData {
	pathname: string;
	redirectTo?: string;
}

type DataFunctionValue = Response | NonNullable<unknown> | null;
type DataFunctionReturnValue = Promise<DataFunctionValue> | DataFunctionValue;

// this any type is from lib itself
export type CustomLoaderFunction<Context = any> = {
	(
		args: LoaderFunctionArgs<Context> & {
			dispatch: AppDispatch;
			initialPath?: string;
		},
		handlerCtx?: unknown,
	): DataFunctionReturnValue;
} & {
	hydrate?: boolean;
};

export const appLoader: CustomLoaderFunction = async ({ dispatch }) => {
	const { pathname } = window.location;
	let redirectTo = '';
	const paramString = window.location.href.split('?')[1];
	const params = new URLSearchParams(paramString);
	const result = Object.fromEntries(params.entries());
	const { deepLinkUrl, notificationUrl } = result;

	if (deepLinkUrl) {
		redirectTo = '/guess/login?deepLinkUrl=' + deepLinkUrl;
		const data = JSON.parse(decodeURIComponent(deepLinkUrl));
		await dispatch(authActions.setSession(data));
	}

	if (notificationUrl) {
		const parsedUrl = new URL(notificationUrl);
		const path = parsedUrl.pathname;
		redirectTo = path;
	}

	dispatch(appActions.setInitialPath(pathname));
	dispatch(appActions.setInitialParams(params));
	return {
		pathname,
		redirectTo,
	} as IAppLoaderData;
};

export const shouldRevalidateApp = () => {
	return false;
};
