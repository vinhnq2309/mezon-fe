import * as Icons from '../../Icons';
import { ChannelTypeEnum } from '@mezon/utils';
import React, { useState } from 'react';

interface ChannelTypeProps {
  type: number;
  onChange: (value: number) => void;
  error?: string;
}

const iconMap = {
  [ChannelTypeEnum.TEXT]: <Icons.Hashtag defaultSize="w-6 h-6" />,
  [ChannelTypeEnum.VOICE]: <Icons.Speaker defaultSize="w-6 h-6" />,
  [ChannelTypeEnum.FORUM]: <Icons.Forum defaultSize="w-6 h-6" />,
  [ChannelTypeEnum.ANNOUNCEMENT]: <Icons.Announcement defaultSize="w-6 h-6" />,
};

const labelMap = {
  [ChannelTypeEnum.TEXT]: 'Text',
  [ChannelTypeEnum.VOICE]: 'Voice',
  [ChannelTypeEnum.FORUM]: 'Forum',
  [ChannelTypeEnum.ANNOUNCEMENT]: 'Announcement',
};

const descriptionMap = {
  [ChannelTypeEnum.TEXT]:
    'Send messages, images, GIFs, emoji, opinions, and puns',
  [ChannelTypeEnum.VOICE]:
    'Hang out together with voice, video, and screen share',
  [ChannelTypeEnum.FORUM]: 'Create a space for organized discussions',
  [ChannelTypeEnum.ANNOUNCEMENT]:
    'Important updates for people in and out of the server',
};

export const ChannelTypeComponent: React.FC<ChannelTypeProps> = ({
  type,
  onChange,
  error,
}) => {
  const onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div
      className={`Frame403 self-stretch px-2 py-3 bg-[#1E1E1E] rounded-lg justify-center items-center gap-4 inline-flex hover:bg-[#2E2E2E]  ${error ? 'border border-red-500' : ' border border-[#1E1E1E]'}`}
    >
      <div className="ChannelChat w-6 h-6 relative">
        {iconMap[type as ChannelTypeEnum]}
      </div>
      <div className="Frame402 grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
        <div className="Text self-stretch text-stone-300 text-base font-bold font-['Manrope'] leading-normal">
          <p>{labelMap[type as ChannelTypeEnum]}</p>
        </div>
        <div className="SendMessagesImagesGifsEmojiOpinionsAndPuns self-stretch text-zinc-400 text-sm font-normal font-['Manrope'] leading-[18.20px]">
          <p>{descriptionMap[type as ChannelTypeEnum]}</p>
        </div>
      </div>
      <div className={`RadioButton p-0.5 justify-start items-start flex  `}>
        <div className="relative flex items-center">
          <input
            className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
            type="radio"
            value={type}
            id={type.toString()}
            name="drone"
            onChange={onValueChange}
          />
        </div>
      </div>
    </div>
  );
};
