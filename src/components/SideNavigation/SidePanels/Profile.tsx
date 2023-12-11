import { Avatar, Card, Modal, ModalContent } from '@nextui-org/react';
import clsx from 'clsx';
import { collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { ChangeEvent, useState } from 'react';
import EosIconsLoading from '~icons/eos-icons/loading';
import MaterialSymbolsEditOutlineRounded from '~icons/material-symbols/edit-outline-rounded';
import { app, db } from '../../../utils/firebase';
import { themeColors } from '../../../utils/theme';
import { CalendarContent, User } from '../../../utils/types';
import AvatarImage from '../avatar.png';

type Props = {
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentUser: User;
  currentCalendarContent: CalendarContent;
};

const Profile: React.FC<Props> = ({
  isProfileModalOpen,
  setIsProfileModalOpen,
  currentUser,
  currentCalendarContent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const storage = getStorage(app);
      const storageRef = ref(storage, currentUser.email);
      await uploadBytes(storageRef, e.target.files[0]);
      const downloadURL = await getDownloadURL(storageRef);

      const usersCollection = collection(db, 'Users');
      const userDocRef = doc(usersCollection, currentUser.email);
      await updateDoc(userDocRef, {
        avatar: downloadURL,
      });
      setIsLoading(false);
    }
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
            'w-full h-full p-10 flex flex-col items-center gap-5',
            themeColors[Number(currentCalendarContent.themeColor)]
              .lightBackground,
          )}
        >
          {/* <div className='text-xl'>Profile</div> */}
          <Card className='relative overflow-visible bg-slate-50 w-80 mt-5'>
            <label
              className={clsx(
                'shadow-lg absolute z-20 left-44 top-2 w-5 h-5 rounded-full flex items-center justify-center hover:cursor-pointer hover:scale-105',
                themeColors[Number(currentCalendarContent.themeColor)]
                  .darkBackground,
              )}
            >
              <input
                type='file'
                accept='image/*'
                className='hidden'
                onChange={(e) => handleInputChange(e)}
              />
              {isLoading ? (
                <EosIconsLoading className='text-white text-xs' />
              ) : (
                <MaterialSymbolsEditOutlineRounded className='text-white text-xs' />
              )}
            </label>

            <Avatar
              src={currentUser.avatar || AvatarImage}
              alt='Avatar'
              className={clsx(
                'absolute -top-8 left-32 w-16 h-16 border-3 border-slate-50',
                //   themeColors[Number(currentCalendarContent.themeColor)]
                //   .lightBorder,
              )}
            />
            <div className='flex flex-col mt-10 mb-4 items-center justify-center gap-1'>
              <div className='text-center text-2xl break-words'>
                {currentUser.name}
              </div>
              <div className='text-center text-lg break-words'>
                {currentUser.email}
              </div>
            </div>
          </Card>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default Profile;
