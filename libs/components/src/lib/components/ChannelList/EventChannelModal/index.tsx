import { useState } from 'react';
import * as Icons from '../../Icons';
import ModalCreate from './ModalCreate';
import { useAuth, useClans, useEventManagement } from '@mezon/core';
import ItemEventManagement from './ModalCreate/itemEventManagement';
import { OptionEvent } from '@mezon/utils';
import DetailItemEvent from '../DetailItemEvent';

export type EventModalProps = {
	open: boolean;
	onClose: () => void;
};

const EventModal = (props: EventModalProps) => {
	const { open, onClose } = props;
	const { userProfile } = useAuth();
	const { currentClan } = useClans();
	const [openModal, setOpenModal] = useState(false);
	const [openModalDetail, setOpenModalDetail] = useState(false);
	const { allEventManagement } = useEventManagement();
	const checkUserCreate = currentClan?.creator_id === userProfile?.user?.id;

	return open ? (
		<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-black bg-opacity-80 dark:text-white text-black hide-scrollbar overflow-hidden">
			{!openModalDetail ?
				<div className={`relative w-full sm:h-auto ${openModal ? 'max-w-[472px]' : 'max-w-[600px]'}`}>
					<div className="rounded-lg overflow-hidden text-sm">
						{!openModal ? (
							<>
								<div className="dark:bg-[#1E1F22] bg-bgLightModeSecond dark:text-white text-black flex justify-between items-center p-4">
									<div className="flex items-center gap-x-4">
										<div className="gap-x-2 flex items-center">
											<Icons.IconEvents />
											<h4>Events</h4>
										</div>
										{ checkUserCreate &&
											<>
												<div className="w-[0.1px] h-4 bg-gray-400"></div>
												<div className="bg-primary px-2 py-1 rounded-md text-white" onClick={() => setOpenModal(true)}>
													Create Event
												</div>
											</>
										}
									</div>
									<span className="text-5xl leading-3 dark:hover:text-white hover:text-black" onClick={onClose}>
										×
									</span>
								</div>
								
								{ allEventManagement.length !== 0 ? 
									<div className='dark:bg-[#313339] bg-white h-fit min-h-80 max-h-[80vh]  overflow-y-scroll hide-scrollbar p-4 gap-y-4 flex flex-col'>
										{allEventManagement.map((event, index)=>{
											return <div key={index}>
												<ItemEventManagement 
													topic={event.title || ''} 
													voiceChannel={event.channel_id || ''} 
													titleEvent={event.title || ''} 
													address={event.address} 
													option={event.address ? OptionEvent.OPTION_LOCATION : OptionEvent.OPTION_SPEAKER} 
													logoRight={event.logo} 
													start={event.start_time || ''} 
													end={event.end_time || ''} 
													event={event} 
													setOpenModalDetail={(status: boolean) => setOpenModalDetail(status)}
													createTime={event.create_time}
													checkUserCreate={checkUserCreate}
												/>
											</div>
										})}
									</div> :
									<div className="dark:bg-[#313339] bg-white h-80 flex justify-center items-center">
										<Icons.IconEvents defaultSize="size-[100px] dark:text-contentTertiary text-colorTextLightMode" />
									</div>
								}
							</>
						) : (
							<ModalCreate onClose={() => setOpenModal(false)} onCloseEventModal={onClose}/>
						)}
					</div>
				</div> :
				<DetailItemEvent setOpenModalDetail={(status: boolean) => setOpenModalDetail(status)}/>
			}
		</div>
	) : null;
};

export default EventModal;
