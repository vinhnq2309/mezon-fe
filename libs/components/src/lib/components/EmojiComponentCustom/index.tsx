import { useEmojis } from '@mezon/core';
import { IEmoji } from '@mezon/utils';
import { useEffect, useRef, useState } from 'react';

type EmojiSuggestionList = {
	valueInput: string;
	isOpen?: boolean;
};

function EmojiList({ valueInput = '' }: EmojiSuggestionList) {
	const { emojis, setEmojiSuggestion } = useEmojis();
	const [suggestions, setSuggestions] = useState<IEmoji[]>([]);
	const [inputCorrect, setInputCorrect] = useState<string>('');
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const ulRef = useRef<HTMLUListElement>(null);

	// const [isOpen, setIsOpen] = useState<boolean>(false);
	// const inputRef = useRef<HTMLInputElement>(null);

	const pickEmoji = (emoji: IEmoji) => {
		setEmojiSuggestion(emoji.skins[0].native);
	};

	const searchEmojiByShortcode = (shortcode: string) => {
		const matchedEmojis: IEmoji[] = [];
		if (emojis) {
			for (const [key, emoji] of Object.entries(emojis)) {
				if (emoji.skins[0]?.shortcodes?.includes(shortcode)) {
					matchedEmojis.push(emoji);
				}
			}
		}
		return matchedEmojis;
	};

	function handleSearchSyntaxEmoji(text: string) {
		const regexSyntaxEmoji = /:([^\s:]+)(?:\s|$)/g;
		const regexSyntaxEmojiEndWithColon = /:([^\s:]+):/g;

		const matches = text.match(regexSyntaxEmoji);
		if (matches) {
			return matches.map((match) => match.slice(1));
		} else {
			const matchesEndWithColon = text.match(regexSyntaxEmojiEndWithColon);
			if (matchesEndWithColon) {
				const result = matchesEndWithColon.map((match) => match)[0];
				const searching = searchEmojiByShortcode(result);
				console.log('s', searching);
				if (searching.length > 0) {
					const emojiFound = searching[0].skins[0].native;
					setEmojiSuggestion(emojiFound);
				}

				return;
			}
		}
		return [];
	}

	useEffect(() => {
		const detectedEmoji = handleSearchSyntaxEmoji(valueInput);
		const emojiSearchWithOutPrefix = detectedEmoji && detectedEmoji[0];
		setInputCorrect(emojiSearchWithOutPrefix ?? '');
	}, [valueInput]);

	useEffect(() => {
		const emojiSuggestions = searchEmojiByShortcode(inputCorrect);
		setSuggestions(emojiSuggestions ?? []);
	}, [inputCorrect]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				setSelectedIndex((prevIndex) => (prevIndex === 0 ? suggestions.length - 1 : prevIndex - 1));
				break;
			case 'ArrowDown':
				e.preventDefault();
				setSelectedIndex((prevIndex) => (prevIndex === suggestions.length - 1 ? 0 : prevIndex + 1));
				break;
			case 'Enter':
				console.log('handleKeyDown');
				// pickEmoji(suggestions[index]);
				break;
			case 'Backspace':
				// Xóa focus khi nhấn phím "Backspace"
				e.preventDefault();
				setSelectedIndex(-1); // Đặt selectedIndex về -1 để không có phần tử nào được chọn
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		console.log('checked:1');
		if (inputCorrect && suggestions.length > 0 && ulRef.current && selectedIndex !== -1) {
			console.log('checked-2');
			const liElement = ulRef.current.children[selectedIndex] as HTMLLIElement | null;
			console.log(liElement);
			if (liElement) {
				liElement.focus();
			}
		}
	}, [selectedIndex, inputCorrect, suggestions]);

	return (
		<>
			{inputCorrect && suggestions.length > 0 && (
				<div className="bg-[#2B2D31] p-3 mb-2 rounded-lg h-fit absolute bottom-10 w-full duration-100">
					<div className="mb-2 font-manrope text-xs font-semibold text-[#B1B5BC]">
						<p>Emoji Matching: {inputCorrect}</p>
					</div>
					<div className="w-full max-h-[20rem] h-fit overflow-y-scroll bg-[#2B2D31] hide-scrollbar">
						<ul ref={ulRef}>
							{suggestions.map((emoji: IEmoji, index) => (
								<li
									key={emoji.id}
									className={`cursor-pointer hover:bg-[#35373C] hover:rounded-sm flex justify-start items-center ${
										index === selectedIndex ? 'bg-[#35373C]' : ''
									}`}
									onKeyDown={(e) => handleKeyDown(e, index)}
									tabIndex={0}
									onClick={() => pickEmoji(emoji)}
								>
									<span className="text-xl w-10 ml-1">{emoji.skins[0].native}</span>
									<span className="text-xs font-manrope">{emoji.skins[0].shortcodes}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	);
}

export default EmojiList;
