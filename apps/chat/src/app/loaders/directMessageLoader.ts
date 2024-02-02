import { LoaderFunction } from "react-router-dom";
import { RootState, channelsActions, directActions, getStoreAsync } from "@mezon/store";
// import { useSelector } from "react-redux";

export const directMessageLoader: LoaderFunction = async ({ params }) => {
    const { directId, type } = params;
    const store = await getStoreAsync();
    if (!directId) {
        throw new Error("DirectMessage ID null");
    }
    console.log("get-loaded");

    store.dispatch(directActions.joinDirectMessage({ directMessageId: directId, channelName: "", type: Number(type) }));

    return null;
};
