import { ILineMention } from '@mezon/utils';
import Markdown from 'react-markdown';
import remarkGFM from 'remark-gfm';
import PreClass from './PreClass';
import { useRef, useState } from 'react';
import ShortUserProfile from '../ShortUserProfile/ShortUserProfile';
import { useClans } from '@mezon/core';
import { useOnClickOutside } from '@mezon/core';
type MarkdownFormatTextProps = {
	mentions: ILineMention[];
};

const MarkdownFormatText = ({ mentions }: MarkdownFormatTextProps) => {
	const [showProfileUser, setIsShowPanelChannel] = useState(false);
	const [userID, setUserID] = useState('');
	const { usersClan } = useClans();
	const handMention = (tagName:string) => {
		setIsShowPanelChannel(true)
		const username = tagName.slice(1)
		const user = usersClan.find((userClan)=> userClan.user?.username === username)
		setUserID(user?.user?.id || '')	
	}
	const panelRef = useRef<HTMLDivElement | null>(null);
	const handleMouseClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {

		if (event.button === 0) {
			setIsShowPanelChannel(true)
		}
	};
	useOnClickOutside(panelRef, () => setIsShowPanelChannel(false));
	return (
			<article className="flex-wrap whitespace-pre-wrap prose prose-pre:min-w-[500px] prose-sm prose-h1:mb-0 prose-ul:leading-[6px] prose-code:text-[15px] prose-blockquote:leading-[6px] prose-blockquote:mt-3 prose-ol:leading-[6px] prose-p:leading-[20px] prose-li:relative prose-li:bottom-[-5px] flex flex-row gap-1"
				ref={panelRef} 
				onMouseDown={(event) => handleMouseClick(event)}
			>
				{showProfileUser? (
					<div className="bg-black mt-[10px] w-[360px] rounded-lg flex flex-col z-10 absolute top-[-500px] right-[200px] opacity-100">
						<ShortUserProfile userID={userID}/>
					</div>
				):null}
				{mentions.map((part, index) => {
					const tagName = part.matchedText;
					const markdown = part.nonMatchText.trim();
					const startsWithTripleBackticks = markdown.startsWith('```');
					const endsWithNoTripleBackticks = !markdown.endsWith('```');
					const onlyBackticks = /^```$/.test(markdown);

					return (
						<div key={index} className="flex flex-row gap-1 lineText">
							{(startsWithTripleBackticks && endsWithNoTripleBackticks) || onlyBackticks ? (
								<span>{markdown}</span>
							) : (
								<Markdown
									children={markdown}
									remarkPlugins={[remarkGFM]}
									components={{
										pre: PreClass,
										p: 'span',
										a: ({ href, children }) => (
											<a
												href={href}
												target="_blank"
												rel="noopener noreferrer"
												style={{ color: 'rgb(59,130,246)' }}
												className="tagLink"
											>
												{children}
											</a>
										),
									}}
								/>
							)}
							{tagName && (
								<span style={{ color: '#3297ff ' }} className="cursor-pointer whitespace-nowrap"
								onClick={()=> handMention(tagName)}
								>
									{tagName}
								</span>
							)}
						</div>
					);
				})}
			</article>
	);
};

export default MarkdownFormatText;
