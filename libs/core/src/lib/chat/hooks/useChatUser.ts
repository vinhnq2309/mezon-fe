import { useMemo } from "react";
import { useMemberStatus } from "../../auth/hooks/useMemberStatus";
import { useSelector } from "react-redux";
import { selectChannelMemberByUserIds } from "@mezon/store";

export function useChatUser(userId: string) {
    const isOnline = useMemberStatus(userId);

    return useMemo(() => ({
        isOnline,

    }), [isOnline])
}