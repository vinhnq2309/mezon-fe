import React, { useState } from "react";
import * as Icons from "../../Icons";
import { Modal } from "@mezon/ui";
import { channelsActions, directActions, getStoreAsync, joinChanel } from "@mezon/store";
import { useAppDispatch } from "@mezon/store";
import { useNavigate } from "react-router-dom";
import { useAppNavigation, useChannelMembers, useChat } from "@mezon/core";
import { ApiCreateChannelDescRequest } from "vendors/mezon-js/packages/mezon-js/dist/api.gen";

interface ModalCreateDMProps {
    onClose: () => void;
    isOpen: boolean;
}

export function ModalCreateDM({ onClose, isOpen }: ModalCreateDMProps) {
    const dispatch = useAppDispatch();
    const { toDmGroupPage } = useAppNavigation();
    const navigate = useNavigate();

    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setSelectedFriends((prevSelectedFriends) => {
            if (prevSelectedFriends.includes(value)) {
                return prevSelectedFriends.filter((friend) => friend !== value);
            } else {
                return [...prevSelectedFriends, value];
            }
        });
    };
    const [isCheck, setIsCheck] = useState<boolean>(false);
    const length: number = selectedFriends.length;
    const handleCreateDM = async () => {
        const bodyCreateDmGroup: ApiCreateChannelDescRequest = {
            type: length > 1 ? 3 : 2,
            channel_private: 1,
            user_ids: selectedFriends,
        };
        console.log("bodycreate", bodyCreateDmGroup);
        setIsCheck(true);
        const response = await dispatch(directActions.createNewDirectMessage(bodyCreateDmGroup));
        const resPayload = response.payload as ApiCreateChannelDescRequest;

        console.log("response-channel", resPayload);
        if (resPayload.channel_id) {
            await dispatch(directActions.joinDirectMessage({ directMessageId: resPayload.channel_id, channelName: resPayload.channel_lable, type: Number(resPayload.type) }));
            const directChat = toDmGroupPage(resPayload.channel_id, Number(resPayload.type));
            navigate(directChat);
        }
        setIsDisable(false);
        setSelectedFriends([]);
        onClose();
    };

    const [searchTerm, setSearchTerm] = useState<string>("");

    interface FriendProps {
        name: string;
        id: string;
    }

    const [friends, setFriends] = useState<FriendProps[]>([
        { name: "USER10", id: "26e7e1ff-7b83-4f46-bb87-58991d0cbdb1" },
        { name: "USER11", id: "4f0ab1da-d153-4965-841d-b8d0123b645d" },
        { name: "Trường LX", id: "842b743e-7dc5-479c-aba8-1f174dd4e621" },
        { name: "Phong NN", id: "e7766349-0e0b-40c2-ad02-603a74d23735" },
    ]);

    const filteredFriends = friends.filter((friend: FriendProps) => friend.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const [isDisable, setIsDisable] = useState(false);

    return (
        <div className="overflow-y-scroll flex-1 pt-3 space-y-[21px] h-32 flex flex-row justify-center text-gray-300 scrollbar-hide font-bold font-['Manrope']">
            <div className="flex flex-row items-center w-full gap-4 h-fit">
                <Modal title="Create DM" showModal={isOpen} onClose={onClose}>
                    <div>
                        <p className="pb-3">Select Friends</p>
                        <input
                            className="bg-gray-700 border  text-gray-900 text-sm rounded-lg  focus:border-blue-500 
                        block ps-10 p-2.5 w-[600px]  dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search user"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                            {filteredFriends.map((friend, index) => (
                                <li key={index}>
                                    <div className="flex items-center p-2 mt-2 rounded ">
                                        <input id={`checkbox-item-${index}`} type="checkbox" value={friend.id} className="w-4 h-4 border border-white cursor-pointer text-blue-600 bg-gray-100  rounded   dark:bg-gray-600 dark:border-gray-500" onChange={handleCheckboxChange} />
                                        <label htmlFor={`checkbox-item-${index}`} className="w-full ms-2 text-sm font-medium cursor-pointer text-white rounded">
                                            {friend.name}
                                        </label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <button disabled={length === 0 || (isDisable && true)} onClick={handleCreateDM} className="w-full bg-blue-700 py-2 disabled:cursor-not-allowed disabled:bg-blue-500">
                            CREATE DM/GROUP
                        </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}
