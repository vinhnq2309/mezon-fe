// import { useChat } from '@mezon/core';
import { useChat } from '@mezon/core';
import { InputField, Modal } from '@mezon/ui';
import * as Icons from '../../Icons';
import { useEffect, useState } from 'react';
import SettingUserClanProfileCard, { Profilesform } from '../SettingUserClanProfileCard';
// import * as Icons from '../../Icons';

// import React, { useState, useEffect } from 'react';
const SettingRightUser = ({
  onClanProfileClick,
  name,
  avatar,
  nameDisplay,
}: {
  onClanProfileClick?: () => void;
  name: string;
  avatar: string;
  nameDisplay: string;
}) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [userName, setUserName] = useState(name);
  const [displayName, setDisplayName] = useState(nameDisplay);
  const [urlImage, setUrlImage] = useState(avatar);
  const { updateUser } = useChat();
  const [flags, setFlags] = useState(true);
  const [flagsRemoveAvartar, setFlagsRemoveAvartar] = useState(false);
  const handleUpdateUser = async () => {
    if (userName || urlImage || displayName) {
      await updateUser(userName, urlImage, displayName);
    }
  };
  const handleFile = (e: any) => {
    const fileToStore: File = e.target.files[0];
    setUrlImage(URL.createObjectURL(fileToStore));
    setFlags(true);
  };
  const handleClose = () => {
    setDisplayName(nameDisplay);
    setUrlImage(avatar);
    setFlags(false);
    setFlagsRemoveAvartar(false);
  };
  const handlSaveClose = () => {
    setFlags(false);
  };
  const editProfile:Profilesform = {
    displayName:  displayName|| '',
    urlImage : urlImage||''
  }
  const handleDisplayName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayName(e.target.value);
    setFlags(true); // Thêm dòng này để gọi setFlags(true) khi có sự thay đổi
  };

  const handleClanProfileButtonClick = () => {
    if (onClanProfileClick) {
      onClanProfileClick();
    }
  };
  const handleRemoveButtonClick = () => {
    setFlagsRemoveAvartar(true);
    setFlags(true);
    setUrlImage('');
  };
  return (
    <div className="overflow-y-auto flex flex-col flex-1 shrink min-w-0 bg-bgSecondary w-1/2 pt-[94px] pr-[40px] pb-[94px] pl-[40px]">
      <div className="mt-[16px] pl-[90px] text-white">
        <h1 className="text-2xl font-medium">Profiles</h1>
        <button className="pt-1 text-white mt-[20px] font-medium text-xl border-b-2 border-blue-500">
          User Profile
        </button>
        <button
          className="pt-1 text-white mt-[20px] font-medium text-xl ml-[16px]"
          onClick={handleClanProfileButtonClick}
        >
          Clan Profile
        </button>
      </div>
      <div className="flex-1 flex mt-[20px] pl-[90px] z-0">
        <div className="w-1/2 text-white">
          <div className="mt-[20px]">
            <label className="font-normal">DISPLAY NAME</label>
            <br />
            <InputField
              onChange={handleDisplayName}
              type="text"
              className="rounded-[3px] w-full text-white border border-black px-4 py-2 mt-2 focus:outline-none focus:border-white-500 bg-black"
              placeholder={displayName}
              value={displayName}
              defaultValue={displayName}
            />
          </div>
          <div className="mt-[20px]">
            <p>AVATAR</p>
            <div className="flex">
              <label>
                <div
                  className="w-[130px] bg-blue-600 rounded-[3px] mt-[10px] p-[8px] pr-[10px] pl-[10px]"
                  onChange={(e) => handleFile(e)}
                >
                  Change avatar
                </div>
                <input
                  type="file"
                  onChange={(e) => handleFile(e)}
                  className="block w-full text-sm text-slate-500 hidden"
                />
              </label>
              <button
                className="bg-gray-600 rounded-[3px] mt-[10px] p-[8px] pr-[10px] pl-[10px] ml-[20px] text-nowrap"
                onClick={handleRemoveButtonClick}
              >
                Remove avatar
              </button>
            </div>
          </div>
          {/* <div className="mt-[20px]">
                        <p>ABOUT ME</p>
                        <textarea className="rounded-[3px] w-full min-h-[3em] resize-none p-[5px] pl-[10px] bg-black mt-[10px]" rows={5}
                            //   onChange={handleChange}
                            placeholder="Introduce something cool..."
                        />
                    </div> */}
        </div>
        <div className="w-1/2 text-white">
          <p className="ml-[30px] mt-[30px]">PREVIEW</p>
          <SettingUserClanProfileCard profiles ={editProfile}/>
        </div>
      </div>
      {(urlImage !== avatar && flags) || (displayName !== nameDisplay && flags) || (flagsRemoveAvartar !== false && flags) ? (
				// <div className="flex items-center w-1/2 h-[50px] mt-[-90px] bg-gray-500 rounded-[8px] z-10 fixed top-[890px] pl-[20px] pr-[20px]">
				<div className="flex flex-row gap-2  bg-gray-500 absolute w-[96] bottom-4 min-w-96 h-fit p-3 rounded transform ">
					<div className="flex-1 flex items-center text-nowrap">
						<p>Carefull - you have unsaved changes!</p>
					</div>

					<div className="flex flex-row justify-end px-2 gap-3">
						<button
							// className="ml-[450px] bg-gray-600 rounded-[8px] p-[8px]"
							className="bg-gray-600 ml-[300px] rounded-[8px] p-[8px]"
							onClick={() => {
								handleClose();
							}}
						>
							Reset
						</button>

						<button
							// className="ml-auto bg-blue-600 rounded-[8px] p-[8px]"
							className="bg-blue-600 rounded-[8px] p-[8px] text-nowrap"
							onClick={() => {
								handleUpdateUser(), handlSaveClose();
							}}
						>
							Save Changes
						</button>
					</div>
				</div>
			) : null}
    </div>
  );
};
export default SettingRightUser;
