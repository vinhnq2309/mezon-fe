import { useApp, useEmojiSuggestion, useInvite } from '@mezon/core';
import { checkMarkdownInText, convertMarkdown, getSrcEmoji } from '@mezon/utils';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { useModal } from 'react-modal-hook';
import remarkGFM from 'remark-gfm';
import ExpiryTimeModal from '../ExpiryTime';
import ChannelHashtag from './HashTag';
import MentionUser from './MentionUser';
import PreClass from './PreClass';
type MarkdownFormatTextProps = {
	lineMessage: string;
};

const MarkdownFormatText = ({ lineMessage }: MarkdownFormatTextProps) => {
	const { getLinkInvite } = useInvite();
	const [openInviteChannelModal, closeInviteChannelModal] = useModal(() => <ExpiryTimeModal onClose={closeInviteChannelModal} open={true} />);
	const getLinkinvite = (children: any) => {
		const inviteId = children.split('/invite/')[1];
		if (inviteId) {
			getLinkInvite(inviteId).then((res) => {
				if (res.expiry_time) {
					if (new Date(res.expiry_time) < new Date()) {
						openInviteChannelModal();
					} else {
						window.location.href = children;
					}
				}
			});
		} else {
			window.open(children, '_blank');
		}
	};
	const { appearanceTheme } = useApp();
	const backtickRegex = /`[^`]*`/g;
	const headingRegex = /^(#{1,6}) (.*)/gm;

	const numberedListRegex = /^\d+\.\s/gm;
	const italicRegex = /\*([^*]+)\*/g;
	const boldRegex = /\*\*([^*]+)\*\*/g;
	const boldItalicRegex = /\*\*\*([^*]+)\*\*\*/g;

	const [isMarkdown, setIsMarkdown] = useState<boolean>(false);
	const startsWithTripleBackticks = lineMessage.startsWith('```');
	const endsWithNoTripleBackticks = !lineMessage.endsWith('```');
	const onlyBackticks = /^```$/.test(lineMessage);
	const isQuote = lineMessage.startsWith('>');
	const [convertedLine, setConvertLine] = useState('');
	const [includeHashtagMention, setInCludeHashtagMention] = useState<boolean>(false);
	const mentionRegex = /(?<=(\s|^))(?:@|#)\S+(?=\s|$|\b\d{19}\b)/g;

	useEffect(() => {
		if (lineMessage) {
			const hasMentionOrHashtag = mentionRegex.test(lineMessage);
			setInCludeHashtagMention(hasMentionOrHashtag);
		} else {
			setInCludeHashtagMention(false);
		}
	}, [lineMessage]);

	useEffect(() => {
		if (
			(startsWithTripleBackticks && endsWithNoTripleBackticks) ||
			backtickRegex.test(lineMessage) ||
			headingRegex.test(lineMessage) ||
			numberedListRegex.test(lineMessage) ||
			italicRegex.test(lineMessage) ||
			boldRegex.test(lineMessage) ||
			boldItalicRegex.test(lineMessage) ||
			isQuote
		) {
			setIsMarkdown(true);
			const result = convertMarkdown(lineMessage);
			setConvertLine(result);
		} else {
			setIsMarkdown(false);
		}
	}, [lineMessage]);

	return (
		<article
			className={`prose-code:text-sm prose-hr:my-0 prose-headings:my-0
			prose-headings:contents prose-h1:prose-2xl whitespace-pre-wrap prose
			prose-base prose-blockquote:leading-[6px] prose-blockquote:my-0 ${appearanceTheme === 'light' ? 'lightMode' : ''}`}
		>
			{!includeHashtagMention && isMarkdown ? (
				<div className="lineText contents">
					{(startsWithTripleBackticks && endsWithNoTripleBackticks) || onlyBackticks ? (
						<span>{lineMessage}</span>
					) : (
						<Markdown
							children={startsWithTripleBackticks && !endsWithNoTripleBackticks ? convertedLine : lineMessage}
							remarkPlugins={[remarkGFM]}
							components={{
								pre: PreClass,
								p: 'span',
								a: ({ children }) => (
									<span
										onClick={() => getLinkinvite(children)}
										rel="noopener noreferrer"
										style={{ color: 'rgb(59,130,246)', cursor: 'pointer' }}
										className="tagLink"
									>
										{children}
									</span>
								),
							}}
						/>
					)}
				</div>
			) : (
				<TextWithMentionHashtagEmoji lineMessage={lineMessage} />
			)}
		</article>
	);
};

export default MarkdownFormatText;

type TextWithMentionHashtagEmojiOpt = {
	lineMessage: string;
};

const TextWithMentionHashtagEmoji = ({ lineMessage }: TextWithMentionHashtagEmojiOpt) => {
	const lineMessageWithSpace = lineMessage.replace('\n', '\n ');

	const { emojiListPNG } = useEmojiSuggestion();
	const splitText = lineMessageWithSpace.split(' ');
	console.log(splitText);
	return (
		<div className="lineText contents gap-1">
			{splitText.map((item, index) => {
				const isMention = item.startsWith('@');
				const isHashtag = item.startsWith('#');
				const isEmojiSyntax = item.match(/:\b[^:]*\b:/g);
				const checkItemIsMarkdown = checkMarkdownInText(item);

				// console.log('---');
				// console.log(item);
				// console.log(isMention);
				// console.log(isHashtag);
				// console.log(isEmojiSyntax);
				// console.log(checkItemIsMarkdown);

				if (isMention && !isHashtag && !isEmojiSyntax && !checkItemIsMarkdown) {
					return (
						<span key={`mention-${index}`}>
							{splitText[index + 1] === ';' ||
							splitText[index + 1] === '.' ||
							splitText[index + 1] === ',' ||
							splitText[index + 1] === ':' ? (
								<MentionUser tagName={item} />
							) : (
								<>
									<MentionUser tagName={item} />{' '}
								</>
							)}
						</span>
					);
				} else if (!isMention && isHashtag && !isEmojiSyntax && !checkItemIsMarkdown) {
					return (
						<span key={`hashtag-${index}`}>
							{splitText[index + 1] === ';' ||
							splitText[index + 1] === '.' ||
							splitText[index + 1] === ',' ||
							splitText[index + 1] === ':' ? (
								<ChannelHashtag channelHastagId={item} />
							) : (
								<>
									<ChannelHashtag channelHastagId={item} />{' '}
								</>
							)}
						</span>
					);
				} else if (!isMention && !isHashtag && !isEmojiSyntax && checkItemIsMarkdown) {
					const getLinkinvite = (children: any) => {
						window.location.href = children;
					};

					return (
						<div key={`url-on-text-${index}`}>
							<Markdown
								children={item}
								remarkPlugins={[remarkGFM]}
								components={{
									pre: PreClass,
									p: 'span',
									a: ({ children }) => (
										<span
											onClick={() => getLinkinvite(children)}
											rel="noopener noreferrer"
											style={{ color: 'rgb(59,130,246)', cursor: 'pointer' }}
											className="tagLink"
										>
											{children}
										</span>
									),
								}}
							/>{' '}
						</div>
					);
				} else if (!isMention && !isHashtag && isEmojiSyntax && !checkItemIsMarkdown) {
					return (
						<span key={`emoji-${index}`} style={{ userSelect: 'none' }}>
							<img
								src={getSrcEmoji(item, emojiListPNG)}
								alt={getSrcEmoji(item, emojiListPNG)}
								className={`${splitText.length === 1 ? 'w-10' : 'w-6'}  h-auto  inline-block relative -top-0.5 m-0`}
								onDragStart={(e) => e.preventDefault()}
							/>{' '}
						</span>
					);
				}
				return <span key={`text-${index}`}>{item} </span>;
			})}
		</div>
	);
};
