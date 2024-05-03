import { ChannelsEntity } from '@mezon/store';
import * as Icons from '../../../Icons';

enum OptionEvent {
	OPTION_SPEAKER = 'Speaker',
	OPTION_HASTAG = 'Hashtag',
}

export type LocationModalProps = {
	option: string;
	voice: string | undefined;
	titleEvent: string;
	voicesChannel: ChannelsEntity[];
	handleVoiceChannel: (content: string) => void;
	handleTitleEvent: (title: string) => void;
	handleOption: (optionEvent: string) => void;
};

const LocationModal = (props: LocationModalProps) => {
	const { handleVoiceChannel, handleTitleEvent, handleOption, voice, titleEvent, voicesChannel, option } = props;

	const handleChangeVoice = (e: any) => {
		handleVoiceChannel(e.target.value);
	};

	const onChangeTitle = (e: any) => {
		handleTitleEvent(e.target.value);
	};

	return (
		<div>
			<div className="flex flex-col mb-4">
				<h3 className="text-xl text-center font-semibold">Where is your event?</h3>
				<p className="text-slate-400 text-center">So no one gets lost on where to go.</p>
			</div>
			<div className="flex flex-col gap-y-4 mb-4">
				<div className="w-full bg-[#2B2D31] rounded flex justify-between items-center p-2">
					<div className="flex items-center gap-x-2">
						<Icons.Speaker />
						<div>
							<h4 className={`font-semibold ${option === OptionEvent.OPTION_SPEAKER ? '' : 'text-slate-400'}`}>Voice Channel</h4>
							<p className={option === OptionEvent.OPTION_SPEAKER ? '' : 'text-slate-400'}>
								Hang out with voice, video, Screen Share and Go Live.
							</p>
						</div>
					</div>
					<input
						checked={option === OptionEvent.OPTION_SPEAKER}
						onChange={() => handleOption(OptionEvent.OPTION_SPEAKER)}
						type="radio"
						className="relative disabled:bg-slate-500  float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
						value="Speaker"
						id="Speaker"
					/>
				</div>
				<div className="w-full bg-[#2B2D31] rounded flex justify-between items-center p-2">
					<div className="flex items-center gap-x-2">
						<Icons.Hashtag />
						<div>
							<h4 className={`font-semibold ${option === OptionEvent.OPTION_HASTAG ? '' : 'text-slate-400'}`}>Somewhere Else</h4>
							<p className={option === OptionEvent.OPTION_HASTAG ? '' : 'text-slate-400'}>
								Text channel, external link or in-person location.
							</p>
						</div>
					</div>
					<input
						checked={option === OptionEvent.OPTION_HASTAG}
						onChange={() => handleOption(OptionEvent.OPTION_HASTAG)}
						type="radio"
						className="relative disabled:bg-slate-500  float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
						value="Hashtag"
						id="Hashtag"
					/>
				</div>
			</div>
			{option === OptionEvent.OPTION_SPEAKER && (
				<div>
					<h3 className="uppercase text-[11px] font-semibold">Select a channel</h3>
					<select
						name="voice"
						value={voice}
						onChange={handleChangeVoice}
						className="block w-full mt-1 bg-black border border-black text-white rounded px-4 py-3 font-normal text-sm tracking-wide"
					>
						<option className="text-white" value="">
							--choose voice channel--
						</option>
						{voicesChannel.map((voice) => (
							<option key={voice.id} className="text-white">
								{voice.channel_label}
							</option>
						))}
					</select>
				</div>
			)}

			{option === OptionEvent.OPTION_HASTAG && (
				<div>
					<h3 className="uppercase text-[11px] font-semibold">Enter a location</h3>
					<input
						type="text"
						name="location"
						value={titleEvent}
						onChange={onChangeTitle}
						placeholder="Add a location, link or something."
						className="bg-bgPrimary font-[400] rounded w-full text-white outline-none text-[15px]border border-black px-4 py-3 focus:outline-none focus:border-white-500"
					/>
				</div>
			)}
		</div>
	);
};

export default LocationModal;
