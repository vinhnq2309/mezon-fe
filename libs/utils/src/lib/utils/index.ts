import {
	differenceInDays,
	differenceInHours,
	differenceInMonths,
	differenceInSeconds,
	format,
	formatDistanceToNowStrict,
	fromUnixTime,
	isSameDay,
	startOfDay,
	subDays,
} from 'date-fns';
import { ApiMessageAttachment, ApiRole, ChannelUserListChannelUser } from 'mezon-js/api.gen';
import { RefObject } from 'react';
import Resizer from 'react-image-file-resizer';
import { TIME_COMBINE } from '../constant';
import {
	ChannelMembersEntity,
	EMarkdownType,
	ETokenMessage,
	EmojiDataOptionals,
	IEmojiOnMessage,
	IExtendedMessage,
	IHashtagOnMessage,
	ILineMention,
	ILinkOnMessage,
	ILinkVoiceRoomOnMessage,
	IMarkdownOnMessage,
	IMentionOnMessage,
	IMessageSendPayload,
	IMessageWithUser,
	MentionDataProps,
	SearchItemProps,
	SenderInfoOptionals,
	UsersClanEntity,
} from '../types/index';

export const convertTimeString = (dateString: string) => {
	const codeTime = new Date(dateString);
	const today = startOfDay(new Date());
	const yesterday = startOfDay(subDays(new Date(), 1));
	if (isSameDay(codeTime, today)) {
		// Date is today
		const formattedTime = format(codeTime, 'HH:mm');
		return `Today at ${formattedTime}`;
	} else if (isSameDay(codeTime, yesterday)) {
		// Date is yesterday
		const formattedTime = format(codeTime, 'HH:mm');
		return `Yesterday at ${formattedTime}`;
	} else {
		// Date is neither today nor yesterday
		const formattedDate = format(codeTime, 'dd/MM/yyyy, HH:mm');
		return formattedDate;
	}
};

export const convertTimeHour = (dateString: string) => {
	const codeTime = new Date(dateString);
	const formattedTime = format(codeTime, 'HH:mm');
	return formattedTime;
};

export const convertDateString = (dateString: string) => {
	const codeTime = new Date(dateString);
	const formattedDate = format(codeTime, 'eee, dd MMMM yyyy');
	return formattedDate;
};

export const getTimeDifferenceInSeconds = (startTimeString: string, endTimeString: string) => {
	const startTime = new Date(startTimeString);
	const endTime = new Date(endTimeString);
	const timeDifferenceInSeconds = differenceInSeconds(endTime, startTime);
	return timeDifferenceInSeconds;
};

export const checkSameDay = (startTimeString: string, endTimeString: string) => {
	if (!startTimeString) return false;
	const startTime = new Date(startTimeString);
	const endTime = new Date(endTimeString);
	const sameDay = isSameDay(startTime, endTime);
	return sameDay;
};

export const focusToElement = (ref: RefObject<HTMLInputElement | HTMLDivElement | HTMLUListElement>) => {
	if (ref?.current) {
		ref.current.focus();
	}
};

export const uniqueUsers = (mentions: ILineMention[], userClans: UsersClanEntity[], userChannels: ChannelMembersEntity[]) => {
	const userMentions = Array.from(new Set(mentions.map((user) => user.matchedText)));

	const userMentionsFormat = userMentions.map((user) => user.substring(1));

	const usersNotInChannels = userMentionsFormat.filter(
		(username) => !userChannels.map((user) => user.user).some((user) => user?.username === username),
	);

	const userInClans = userClans.map((clan) => clan.user);

	const userIds = userInClans.filter((user) => usersNotInChannels.includes(user?.username as string)).map((user) => user?.id as string);

	return userIds;
};

export const convertTimeMessage = (timestamp: string) => {
	const textTime = formatDistanceToNowStrict(new Date(parseInt(timestamp) * 1000), { addSuffix: true });
	return textTime;
};

export const isGreaterOneMonth = (timestamp: string) => {
	const date = new Date(parseInt(timestamp) * 1000);
	const now = new Date();
	const result = differenceInDays(now, date);
	return result;
};

export const calculateTotalCount = (senders: SenderInfoOptionals[]) => {
	return senders.reduce((sum: number, item: SenderInfoOptionals) => sum + (item.count ?? 0), 0);
};

export const notImplementForGifOrStickerSendFromPanel = (data: ApiMessageAttachment) => {
	if (data.url?.includes('tenor.com') || data.filetype === 'image/gif') {
		return true;
	} else {
		return false;
	}
};

export const getVoiceChannelName = (clanName?: string, channelLabel?: string) => {
	return clanName?.replace(' ', '-') + '-' + channelLabel?.replace(' ', '-');
};

export const removeDuplicatesById = (array: any) => {
	return array.reduce((acc: any, current: any) => {
		const isDuplicate = acc.some((item: any) => item.id === current.id);
		if (!isDuplicate) {
			acc.push(current);
		}
		return acc;
	}, []);
};

export const getTimeDifferenceDate = (dateString: string) => {
	const now = new Date();
	const codeTime = new Date(dateString);
	const hoursDifference = differenceInHours(now, codeTime);
	const daysDifference = differenceInDays(now, codeTime);
	const monthsDifference = differenceInMonths(now, codeTime);
	if (hoursDifference < 24) {
		return `${hoursDifference}h`;
	} else if (daysDifference < 30) {
		return `${daysDifference}d`;
	} else {
		return `${monthsDifference}mo`;
	}
};

export const convertMarkdown = (markdown: string): string => {
	return markdown
		.split('```')
		.map((part, index) => {
			if (part.length === 0) {
				return '```';
			}
			const start = part.startsWith('\n');
			const end = part.endsWith('\n');

			if (start && end) {
				return part;
			}
			if (start) {
				return part + '\n';
			}
			if (end) {
				return '\n' + part;
			}
			return '\n' + part + '\n';
		})
		.join('');
};

export const getSrcEmoji = (id: string) => {
	return process.env.NX_BASE_IMG_URL + 'emojis/' + id + '.webp';
};

export const convertReactionDataFromMessage = (message: IMessageWithUser) => {
	const emojiDataItems: Record<string, EmojiDataOptionals> = {};
	message.reactions!.forEach((reaction) => {
		const key = `${message.id}_${reaction.sender_id}_${reaction.emoji}`;

		if (!emojiDataItems[key]) {
			emojiDataItems[key] = {
				id: reaction.id,
				emoji: reaction.emoji,
				emojiId: reaction.emoji_id,
				senders: [
					{
						sender_id: reaction.sender_id,
						count: reaction.count,
					},
				],
				channel_id: message.channel_id,
				message_id: message.id,
			};
		} else {
			const existingItem = emojiDataItems[key];

			if (existingItem.senders.length > 0) {
				existingItem.senders[0].count = reaction.count;
			}
		}
	});
	return Object.values(emojiDataItems);
};

export const checkLastChar = (text: string) => {
	if (
		text.charAt(text.length - 1) === ';' ||
		text.charAt(text.length - 1) === ',' ||
		text.charAt(text.length - 1) === '.' ||
		text.charAt(text.length - 1) === ':'
	) {
		return true;
	} else {
		return false;
	}
};

export const getNameForPrioritize = (clanNickname: string | undefined, displayName: string | undefined, username: string | undefined) => {
	if (clanNickname && clanNickname !== '') {
		return clanNickname;
	} else if (displayName && displayName !== '') {
		return displayName;
	} else {
		return username;
	}
};

export const getAvatarForPrioritize = (clanAvatar: string | undefined, userAvatar: string | undefined) => {
	if (clanAvatar && clanAvatar !== userAvatar) return clanAvatar;
	return userAvatar;
};

export function compareObjects(a: any, b: any, searchText: string, prioritizeProp: string, nameProp?: string) {
	const normalizedSearchText = searchText.toUpperCase();

	const aIndex = a[prioritizeProp]?.toUpperCase().indexOf(normalizedSearchText) ?? -1;
	const bIndex = b[prioritizeProp]?.toUpperCase().indexOf(normalizedSearchText) ?? -1;

	if (nameProp) {
		const aNameIndex = a[nameProp]?.toUpperCase().indexOf(normalizedSearchText) ?? -1;
		const bNameIndex = b[nameProp]?.toUpperCase().indexOf(normalizedSearchText) ?? -1;

		if (aIndex === -1 && bIndex === -1) {
			return aNameIndex - bNameIndex;
		}

		if (aIndex !== bIndex) {
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			return aIndex - bIndex;
		}

		return aNameIndex - bNameIndex;
	} else {
		if (aIndex === -1 && bIndex === -1) {
			return 0;
		}

		if (aIndex !== bIndex) {
			if (aIndex === -1) return 1;
			if (bIndex === -1) return -1;
			return aIndex - bIndex;
		}
		return (a[prioritizeProp]?.toUpperCase() ?? '').localeCompare(b[prioritizeProp]?.toUpperCase() ?? '');
	}
}

export function normalizeString(str: string): string {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toUpperCase();
}

export function searchMentionsHashtag(searchValue: string, list: MentionDataProps[]) {
	if (!searchValue) return list;

	// Normalize and remove diacritical marks from the search value
	const normalizedSearchValue = normalizeString(searchValue).toUpperCase();
	const filteredList: MentionDataProps[] = list.filter((mention) => {
		const displayNormalized = normalizeString(mention.display ?? '').toUpperCase();
		const usernameNormalized = normalizeString(mention.username ?? '').toUpperCase();
		return displayNormalized.includes(normalizedSearchValue) || usernameNormalized.includes(normalizedSearchValue);
	});
	// Sort the filtered list
	const sortedList = filteredList.sort((a, b) => compareObjects(a, b, normalizedSearchValue, 'display', 'display'));
	return sortedList;
}

export const ValidateSpecialCharacters = () => {
	return /^(?![_\-\s])(?:(?!')[a-zA-Z0-9\p{L}\p{N}\p{Emoji_Presentation}_\-\s]){1,64}$/u;
};

export const checkSameDayByCreateTimeMs = (unixTime1: number, unixTime2: number) => {
	const date1 = fromUnixTime(unixTime1 / 1000);
	const date2 = fromUnixTime(unixTime2 / 1000);

	return isSameDay(date1, date2);
};

export const checkContinuousMessagesByCreateTimeMs = (unixTime1: number, unixTime2: number) => {
	return Math.abs(unixTime1 - unixTime2) <= TIME_COMBINE;
};

export const checkSameDayByCreateTime = (createTime1: string | Date, createTime2: string | Date) => {
	const ct1 = typeof createTime1 === 'string' ? createTime1 : createTime1.toISOString();
	const ct2 = typeof createTime2 === 'string' ? createTime2 : createTime2.toISOString();

	return Boolean(ct1 && ct2 && ct1.startsWith(ct2.substring(0, 10)));
};

export const formatTimeToMMSS = (duration: number): string => {
	const minutes = Math.floor(duration / 60);
	const seconds = Math.floor(duration % 60);
	return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export const resizeFileImage = (file: File, maxWidth: number, maxHeight: number, type: string, minWidth?: number, minHeight?: number) =>
	new Promise((resolve) => {
		Resizer.imageFileResizer(
			file,
			maxWidth,
			maxHeight,
			'JPEG',
			100,
			0,
			(uri) => {
				resolve(uri);
			},
			type,
			minWidth,
			minHeight,
		);
	});

export function findClanAvatarByUserId(userId: string, data: ChannelUserListChannelUser[]) {
	for (let item of data) {
		if (item?.user?.id === userId) {
			return item.clan_avatar;
		}
	}
	return '';
}

export function findClanNickByUserId(userId: string, data: ChannelUserListChannelUser[]) {
	for (let item of data) {
		if (item?.user?.id === userId) {
			return item.clan_nick;
		}
	}
	return '';
}

export function findDisplayNameByUserId(userId: string, data: ChannelUserListChannelUser[]) {
	for (let item of data) {
		if (item?.user?.id === userId) {
			return item.user.display_name;
		}
	}
	return '';
}

export function addAttributesSearchList(data: SearchItemProps[], dataUserClan: ChannelUserListChannelUser[]): SearchItemProps[] {
	return data.map((item) => {
		const avatarClanFinding = findClanAvatarByUserId(item.id ?? '', dataUserClan);
		const clanNickFinding = item?.clanNick;
		const prioritizeName = getNameForPrioritize(clanNickFinding ?? '', item.displayName ?? '', item.name ?? '');
		return {
			...item,
			clanAvatar: avatarClanFinding,
			clanNick: clanNickFinding,
			prioritizeName: prioritizeName,
		};
	});
}

export function filterListByName(listSearch: SearchItemProps[], searchText: string, isSearchByUsername: boolean): SearchItemProps[] {
	return listSearch.filter((item: SearchItemProps) => {
		if (isSearchByUsername) {
			const searchName = normalizeString(searchText.slice(1));
			const itemName = item.name ? normalizeString(item.name) : '';
			return itemName.includes(searchName);
		} else {
			const searchUpper = normalizeString(searchText.startsWith('#') ? searchText.substring(1) : searchText);
			const prioritizeName = item.prioritizeName ? normalizeString(item.prioritizeName) : '';
			const itemName = item.name ? normalizeString(item.name) : '';
			return prioritizeName.includes(searchUpper) || itemName.includes(searchUpper);
		}
	});
}

export function sortFilteredList(filteredList: SearchItemProps[], searchText: string, isSearchByUsername: boolean): SearchItemProps[] {
	return filteredList.sort((a: SearchItemProps, b: SearchItemProps) => {
		if (searchText === '' || searchText.startsWith('@' || searchText.startsWith('#'))) {
			return (b.lastSentTimeStamp || 0) - (a.lastSentTimeStamp || 0);
		} else if (searchText.startsWith('#')) {
			return compareObjects(a, b, searchText.substring(1), 'prioritizeName');
		} else if (isSearchByUsername) {
			const searchWithoutAt = searchText.slice(1);
			return compareObjects(a, b, searchWithoutAt, 'name', 'prioritizeName');
		} else {
			return compareObjects(a, b, searchText, 'prioritizeName', 'name');
		}
	});
}
export const getRoleList = (rolesInClan: ApiRole[]) => {
	return rolesInClan.map((item) => ({
		roleId: item.id ?? '',
		roleName: item.title ?? '',
	}));
};

type ElementToken =
	| (IMentionOnMessage & { kindOf: ETokenMessage.MENTIONS })
	| (IHashtagOnMessage & { kindOf: ETokenMessage.HASHTAGS })
	| (IEmojiOnMessage & { kindOf: ETokenMessage.EMOJIS })
	| (ILinkOnMessage & { kindOf: ETokenMessage.LINKS })
	| (IMarkdownOnMessage & { kindOf: ETokenMessage.MARKDOWNS })
	| (ILinkVoiceRoomOnMessage & { kindOf: ETokenMessage.VOICE_LINKS });

export const createFormattedString = (data: IExtendedMessage): string => {
	let { t = '' } = data;
	const elements: ElementToken[] = [];
	(Object.keys(data) as (keyof IExtendedMessage)[]).forEach((key) => {
		const itemArray = data[key];

		if (Array.isArray(itemArray)) {
			itemArray.forEach((item) => {
				if (item) {
					const typedItem: ElementToken = { ...item, kindOf: key as any }; // Casting key as any
					elements.push(typedItem);
				}
			});
		}
	});

	elements.sort((a, b) => {
		const startA = a.s ?? 0;
		const startB = b.s ?? 0;
		return startA - startB;
	});
	let result = '';
	let lastIndex: number = 0;

	elements.forEach((element) => {
		const startindex = element.s ?? lastIndex;
		const endindex = element.e ?? startindex;
		result += t.slice(lastIndex, startindex);
		const contentInElement = t?.substring(startindex, endindex);
		switch (element.kindOf) {
			case ETokenMessage.MENTIONS: {
				if (element.user_id) {
					result += `@[${contentInElement.slice(1)}](${element.user_id})`;
				} else if (element.role_id) {
					result += `@[${contentInElement.slice(1)}](${element.role_id})`;
				}
				break;
			}
			case ETokenMessage.HASHTAGS:
				result += `#[${contentInElement.slice(1)}](${element.channelid})`;
				break;
			case ETokenMessage.EMOJIS:
				result += `[${contentInElement}](${element.emojiid})`;
				break;
			case ETokenMessage.LINKS:
				result += `${contentInElement}`;
				break;
			case ETokenMessage.MARKDOWNS:
				result += `${contentInElement}`;
				break;
			case ETokenMessage.VOICE_LINKS:
				result += `${contentInElement}`;
				break;
			default:
				break;
		}
		lastIndex = endindex;
	});

	result += t.slice(lastIndex);

	return result;
};

export const processText = (inputString: string) => {
	const links: ILinkOnMessage[] = [];
	const markdowns: IMarkdownOnMessage[] = [];
	const voiceRooms: ILinkVoiceRoomOnMessage[] = [];

	const singleBacktick: string = '`';
	const tripleBacktick: string = '```';
	const httpPrefix: string = 'http';
	const googleMeetPrefix: string = 'https://meet.google.com/';

	let i = 0;
	while (i < inputString.length) {
		if (inputString.startsWith(httpPrefix, i)) {
			// Link processing
			const startindex = i;
			i += httpPrefix.length;
			while (i < inputString.length && ![' ', '\n', '\r', '\t'].includes(inputString[i])) {
				i++;
			}
			const endindex = i;
			const link = inputString.substring(startindex, endindex);

			if (link.startsWith(googleMeetPrefix)) {
				voiceRooms.push({
					s: startindex,
					e: endindex,
				});
			} else {
				links.push({
					s: startindex,
					e: endindex,
				});
			}
		} else if (inputString.substring(i, i + tripleBacktick.length) === tripleBacktick) {
			// Triple backtick markdown processing
			const startindex = i;
			i += tripleBacktick.length;
			let markdown = '';
			while (i < inputString.length && inputString.substring(i, i + tripleBacktick.length) !== tripleBacktick) {
				markdown += inputString[i];
				i++;
			}
			if (i < inputString.length && inputString.substring(i, i + tripleBacktick.length) === tripleBacktick) {
				i += tripleBacktick.length;
				const endindex = i;
				if (markdown.trim().length > 0) {
					markdowns.push({ type: EMarkdownType.TRIPLE, s: startindex, e: endindex });
				}
			}
		} else if (inputString[i] === singleBacktick) {
			// Single backtick markdown processing
			const startindex = i;
			i++;
			let markdown = '';
			while (i < inputString.length && inputString[i] !== singleBacktick) {
				markdown += inputString[i];
				i++;
			}
			if (i < inputString.length && inputString[i] === singleBacktick) {
				const endindex = i + 1;
				const nextChar = inputString[endindex];
				if (!markdown.includes('``') && markdown.trim().length > 0 && nextChar !== singleBacktick) {
					markdowns.push({ type: EMarkdownType.SINGLE, s: startindex, e: endindex });
				}
				i++;
			}
		} else {
			i++;
		}
	}
	return { links, markdowns, voiceRooms };
};

export function addMention(obj: IMessageSendPayload, mentionValue: IMentionOnMessage[]): IExtendedMessage {
	const updatedObj: IExtendedMessage = {
		...obj,
		mentions: mentionValue,
	};

	return updatedObj;
}

export function isValidEmojiData(data: IExtendedMessage): boolean | undefined {
	if (data?.mentions && data.mentions.length !== 0) {
		return false;
	}

	const validShortnames = data?.ej?.map((emoji: IEmojiOnMessage) => data.t?.substring(emoji.s ?? 0, emoji.e));

	const shortnamesInT = data?.t
		?.split(' ')
		?.map((shortname: string) => shortname.trim())
		?.filter((shortname: string) => shortname);

	return shortnamesInT?.every((name: string) => validShortnames?.includes(name)) && shortnamesInT.join(' ') === data?.t?.trim();
}
export const buildLPSArray = (pattern: string): number[] => {
	const lps = Array(pattern.length).fill(0);
	let len = 0;
	let i = 1;

	while (i < pattern.length) {
		if (pattern[i] === pattern[len]) {
			len++;
			lps[i] = len;
			i++;
		} else {
			if (len !== 0) {
				len = lps[len - 1];
			} else {
				lps[i] = 0;
				i++;
			}
		}
	}
	return lps;
};

export const KMPHighlight = (text: string, pattern: string): number[] => {
	const lps = buildLPSArray(pattern);
	const matchPositions: number[] = [];
	let i = 0;
	let j = 0;

	while (i < text.length) {
		if (pattern[j] === text[i]) {
			i++;
			j++;
		}

		if (j === pattern.length) {
			matchPositions.push(i - j);
			j = lps[j - 1];
		} else if (i < text.length && pattern[j] !== text[i]) {
			if (j !== 0) {
				j = lps[j - 1];
			} else {
				i++;
			}
		}
	}

	return matchPositions;
};

export function filterEmptyArrays<T extends Record<string, any>>(payload: T): T {
	return Object.entries(payload)
		.filter(([_, value]) => !(Array.isArray(value) && value.length === 0))
		.reduce((acc, [key, value]) => {
			return { ...acc, [key]: value };
		}, {} as T);
}

export const handleFiles = (files: File[], setAttachmentPreview: (attachments: ApiMessageAttachment[]) => void) => {
	// const files = e.target.files;

	if (!files) {
		throw new Error('Client or files are not initialized');
	}

	const fileArray = Array.from(files);

	// Process files
	const filePromises = fileArray.map((file) => {
		if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
			return processFile(file)
				.then((fileDetails) => {
					return {
						filename: fileDetails.filename,
						filetype: fileDetails.filetype,
						size: 0,
						url: fileDetails.url,
					} as ApiMessageAttachment;
				})
				.catch((error) => {
					console.error('Error processing file:', error);
					return null;
				});
		} else {
			const url = `${file.name};${file.type};${file.lastModified};${file.size}`;
			return Promise.resolve({
				filename: file.name,
				filetype: file.type,
				size: 0,
				url: url,
			} as ApiMessageAttachment);
		}
	});

	Promise.all(filePromises)
		.then((attachments) => {
			const validAttachments: ApiMessageAttachment[] = attachments.filter(
				(attachment): attachment is ApiMessageAttachment => attachment !== null,
			);
			setAttachmentPreview(validAttachments);
		})
		.catch((error) => {
			console.error('Error processing files:', error);
		});
};

export function base64ToBlob(base64: string, contentType: string, sliceSize = 512): Blob {
	const byteCharacters = atob(base64);
	const byteArrays: Uint8Array[] = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length);

		for (let i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		byteArrays.push(new Uint8Array(byteNumbers));
	}

	return new Blob(byteArrays, { type: contentType });
}

export function processFile(file: File): Promise<{ filename: string; filetype: string; size: number; url: string }> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			try {
				const base64StringWithPrefix = reader.result as string;
				const base64String = base64StringWithPrefix.split(',')[1];

				const contentType = file.type;

				const blob = base64ToBlob(base64String, contentType);
				const blobUrl = URL.createObjectURL(blob);

				resolve({
					filename: file.name,
					filetype: file.type,
					size: 0,
					url: blobUrl,
				});
			} catch (error) {
				reject(error);
			}
		};

		reader.onerror = () => {
			reject(new Error('Failed to read file'));
		};

		reader.readAsDataURL(file);
	});
}

// Function to parse the URL string
export const parseUrlAttachment = (url: string) => {
	// Split the URL by the delimiter `;`
	const parts = url.split(';');

	// Check if the parts array has the correct length
	if (parts.length !== 4) {
		throw new Error('Invalid URL format');
	}

	// Destructure the parts into individual variables
	const [name, type, lastModified, size] = parts;

	// Convert lastModified and size to numbers
	const lastModifiedDate = parseInt(lastModified, 10);
	const fileSize = parseInt(size, 10);

	return {
		name,
		type,
		lastModified: lastModifiedDate,
		size: fileSize,
	};
};
