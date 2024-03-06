import { IMessageWithUser, convertTimeHour, convertTimeString } from "@mezon/utils";
import { useMemo } from "react";


export function useMessageParser( message: IMessageWithUser) {
    const attachments = useMemo(() => {
		return message.attachments as any;
	}, [message])

    const mentions = useMemo(() => {
		return message.mentions as any;
	}, [message])

	const content = useMemo(() => {
		return message.content as any;
	}, [message]);

    const lines =   useMemo(() => {
        const values = content.t?.split('\n');
		return values
	}, [content]);    

    const messageTime = useMemo(() => {
        return convertTimeString(message?.create_time as string)
    }, [message])

    const messageHour = useMemo(() => {
        return convertTimeHour(message?.create_time || '' as string)
    }, [message])

    return {
        content,
        messageTime,
        messageHour,
        attachments,
        mentions,
        lines
    }
}