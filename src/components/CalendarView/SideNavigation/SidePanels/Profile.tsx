import { Avatar, Card, Modal, ModalContent } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import EosIconsLoading from '~icons/eos-icons/loading';
import MaterialSymbolsEditOutlineRounded from '~icons/material-symbols/edit-outline-rounded';
import { firebase } from '../../../../utils/firebase';
import { User, themeColor } from '../../../../utils/types';
import AvatarImage from '../img/avatar.png';

type Props = {
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User;
  currentThemeColor: themeColor;
};

const Profile: React.FC<Props> = ({
  isProfileModalOpen,
  setIsProfileModalOpen,
  currentUser,
  currentThemeColor,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpdateUserAvatar = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;

    setIsUploading(true);
    await firebase.updateUserAvatar(currentUser.email, e.target.files[0]);
    setIsUploading(false);
  };

  return (
    <Modal
      isOpen={isProfileModalOpen}
      onOpenChange={(isOpen) => {
        setIsProfileModalOpen(isOpen);
      }}
      size='md'
    >
      <ModalContent>
        <div
          className={clsx(
            'max-h-[calc(100vh_-_130px)] overflow-y-auto w-full h-full p-10 flex flex-col items-center gap-5',
            currentThemeColor.lightBackground,
          )}
        >
          <Card className='relative overflow-visible bg-slate-50 w-80 mt-5'>
            <label
              className={clsx(
                'shadow-lg absolute z-20 left-44 top-2 w-5 h-5 rounded-full flex items-center justify-center hover:cursor-pointer hover:scale-105',
                currentThemeColor.darkBackground,
              )}
            >
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={async (e) => handleUpdateUserAvatar(e)}
              />
              {isUploading ? (
                <EosIconsLoading className='text-white text-xs' />
              ) : (
                <MaterialSymbolsEditOutlineRounded className='text-white text-xs' />
              )}
            </label>

            <Avatar
              src={currentUser.avatar || AvatarImage}
              alt='Avatar'
              className='absolute -top-8 left-32 w-16 h-16 border-3 border-slate-50 object-cover object-center'
            />
            <div className='flex flex-col mt-10 mb-4 px-6 items-center justify-center gap-1 overflow-x-auto'>
              <div className='text-center text-2xl break-words max-w-full'>
                {currentUser.name}
              </div>
              <div className='text-center text-lg break-words max-w-full'>
                {currentUser.email}
              </div>
            </div>
          </Card>
        </div>
      </ModalContent>
    </Modal>
  );
};

export { Profile };
