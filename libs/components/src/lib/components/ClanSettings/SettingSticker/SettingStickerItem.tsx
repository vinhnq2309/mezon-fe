import {
	deleteSticker,
	selectCurrentUserId,
	selectMemberClanByUserId,
	useAppDispatch,
	useAppSelector
} from "@mezon/store";
import { ApiClanSticker } from "mezon-js/api.gen";
import { useSelector } from "react-redux";
import { Icons } from "../../../components";
import { useClanRestriction } from "@mezon/core";
import { EPermission } from "@mezon/utils";
import { useMemo } from "react";

type SettingEmojiListProps = {
  updateSticker: (sticker: ApiClanSticker) => void;
  sticker: ApiClanSticker
};

const SettingStickerItem = ({ sticker, updateSticker }: SettingEmojiListProps) => {
  const dataAuthor = useSelector(selectMemberClanByUserId(sticker.creator_id ?? ''));
  const dispatch = useAppDispatch();
	const [hasAdminPermission, {isClanOwner}] = useClanRestriction([EPermission.administrator]);
	const [hasManageClanPermission] = useClanRestriction([EPermission.manageClan])
	const currentUserId = useAppSelector(selectCurrentUserId);
	const hasDeleteOrEditPermission = useMemo(() => {
		return hasAdminPermission || isClanOwner || hasManageClanPermission || currentUserId === sticker.creator_id
	}, [hasAdminPermission, hasManageClanPermission, currentUserId, isClanOwner]) ;

  const handleUpdateSticker = () => {
    updateSticker(sticker);
  }
  const handleDeleteSticker = async () => {
    if (sticker.id) {
      await dispatch(deleteSticker(sticker.id));
    }
  }
  return (
    <div className={'group relative text-xs w-[116px] h-[140px] rounded-lg flex flex-col items-center p-3 dark:hover:bg-bgTertiary dark:bg-bgSecondary bg-bgLightSecondary justify-between'}>
      <div className="aspect-square h-[72px] overflow-hidden flex justify-center">
        <img className={' w-auto h-full object-cover select-none'} src={sticker.source} />
      </div>
      <p className="font-semibold dark:text-white text-textPrimaryLight">{sticker.shortname}</p>
      <div className="flex items-end justify-center gap-1">
        <img className="w-4 h-4 rounded-full select-none" src={dataAuthor.user?.avatar_url} />
        <p className="dark:text-white text-textPrimaryLight max-w-20 truncate">{dataAuthor.user?.username}</p>
      </div>
	    {hasDeleteOrEditPermission && (
		    <div className="group-hover:flex absolute flex-col right-[-12px] top-[-12px] gap-1 hidden select-none">
			    <button onClick={handleUpdateSticker} className="aspect-square w-6 rounded-full text-textPrimaryLight dark:text-textPrimary bg-bgLightModeSecond hover:bg-bgLightModeThird  dark:bg-bgSecondary600 dark:hover:bg-bgSurface flex items-center justify-center shadow-sm"><Icons.EditMessageRightClick defaultSize="w-3 h-3" /></button>
			    <button onClick={handleDeleteSticker} className="aspect-square w-6 text-sm rounded-full bg-bgLightModeSecond hover:bg-bgLightModeThird dark:bg-bgSecondary600 dark:hover:bg-bgSurface flex items-center justify-center mb-[1px] font-medium text-red-600 shadow-sm">x</button>
		    </div>
	    )}
    </div>
  )
}

export default SettingStickerItem;
