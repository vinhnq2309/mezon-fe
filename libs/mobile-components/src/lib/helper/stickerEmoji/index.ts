import { useEmojiSuggestion } from '@mezon/core';
import { uploadFile } from "@mezon/transport";
import { IEmoji } from '@mezon/utils';
import { Buffer as BufferMobile } from 'buffer';
import { Client, Session } from "mezon-js";
import { ApiMessageAttachment } from "mezon-js/api.gen";
import { STORAGE_RECENT_EMOJI } from '../../constant';
import { load, save } from '../storage';

interface IFile {
    uri: string;
    name: string;
    type: string;
    size: number;
    fileData: any;
}

interface IEmojiWithChannel {
    [key: string]: IEmoji[]
}

export async function handleUploadEmoticonMobile(client: Client, session: Session, filename: string, file: IFile): Promise<ApiMessageAttachment> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<ApiMessageAttachment>(async function (resolve, reject) {
        try {
            let fileType = file.type;
            if (!fileType) {
                const fileNameParts = file.name.split('.');
                const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase();
                fileType = `text/${fileExtension}`;
            }

            const arrayBuffer = BufferMobile.from(file.fileData, 'base64');
            if (!arrayBuffer) {
                console.log('Failed to read file data.');
                return;
            }

            resolve(uploadFile(client, session, filename, fileType, Number(file.size) || 0, arrayBuffer, true));
        } catch (error) {
            console.log('handleUploadEmojiStickerMobile Error: ', error);
            reject(new Error(`${error}`));
        }
    });
}

export function getEmojis(clan_id: string) {
    const { categoriesEmoji, emojis } = useEmojiSuggestion();
    const recentEmojis: IEmojiWithChannel = load(STORAGE_RECENT_EMOJI) || {};

    const recentChannelEmojis = recentEmojis[clan_id] || [];
    return {
        categoriesEmoji,
        emojis: [...recentChannelEmojis, ...emojis],
    }
}

export async function setRecentEmoji(emoji: IEmoji, clan_id: string) {
    const oldRecentEmojis: IEmojiWithChannel = load(STORAGE_RECENT_EMOJI) || {};
    const oldRecentChannelEmojis: IEmoji[] = oldRecentEmojis[clan_id] || [];
    if (oldRecentChannelEmojis.every(e => e.id !== emoji.id)) {
        const currentRecentChannelEmojis: IEmoji[] = [{ ...emoji, category: "Recent" }, ...oldRecentChannelEmojis];
        const currentEmoji = { ...oldRecentEmojis, [clan_id]: currentRecentChannelEmojis }
        save(STORAGE_RECENT_EMOJI, currentEmoji);
    }
}