import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { Timestamp, collection, deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import MaterialSymbolsSubdirectoryArrowLeftRounded from '~icons/material-symbols/subdirectory-arrow-left-rounded';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { addNewComment } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';
import { defaultTags, initialEvent } from '../../utils/types';
import avatarImage from '../SideNavigation/avatar.png';

interface Props {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const View: React.FC<Props> = ({ setIsEditing }) => {
  const { selectedEvent, setIsEditModalOpen, setSelectedEvent } =
    useModalStore();
  const { currentUser, currentCalendarId, currentCalendarContent } =
    useAuthStore();

  const renderTime = () => {
    const startDate = selectedEvent.startAt
      ? selectedEvent.startAt
      : new Date();
    const endDate = selectedEvent.endAt ? selectedEvent.endAt : new Date();

    if (selectedEvent.isMemo) {
      return <div>Memo</div>;
    }

    if (selectedEvent.isAllDay) {
      const start = format(startDate, 'yyyy E, LLL dd');
      const end = format(endDate, 'yyyy E, LLL dd');
      if (start === end) {
        return <div>{start}</div>;
      }
      return (
        <>
          <div>{start}</div>
          <div>－</div>
          <div>{end}</div>
        </>
      );
    }
    const start = format(startDate, 'E, LLL dd yyyy HH:mm');
    const end = format(endDate, 'E, LLL dd yyyy HH:mm');
    return (
      <>
        <div>{start}</div>
        <div>－</div>
        <div>{end}</div>
      </>
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const eventsCollection = collection(
      db,
      'Calendars',
      currentCalendarId,
      'events',
    );
    const eventRef = doc(eventsCollection, selectedEvent.eventId.toString());
    await deleteDoc(eventRef);
    setIsEditModalOpen(false, initialEvent);
  };

  const calendarTags = currentCalendarContent.tags || defaultTags;

  const [commentInput, setCommentInput] = useState('');
  const handleAddComment = () => {
    addNewComment(
      currentCalendarId,
      selectedEvent.eventId.toString(),
      currentUser,
      commentInput,
      setSelectedEvent,
    );
    setCommentInput('');
  };

  const formatTime = (time: Timestamp) => {
    const originTime = new Date(time.seconds * 1000);
    let formattedTime = '';
    try {
      if (time) {
        formattedTime = format(originTime, 'EEE, LLL dd yyyy HH:mm');
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      formattedTime = format(new Date(), 'EEE, LLL dd yyyy HH:mm');
    }
    return formattedTime;
  };

  const renderComments = () => {
    if (selectedEvent.isMemo) return;
    return (
      <div className='h-40 flex flex-col gap-2 overflow-y-auto'>
        {selectedEvent.messages.map((message, index) => (
          <div
            key={index}
            className={clsx('flex gap-1', {
              'justify-end': currentUser.userId === message.arthur.userId,
            })}
          >
            <div
              className={clsx('flex gap-1 w-3/5', {
                'justify-end': currentUser.userId === message.arthur.userId,
              })}
            >
              {currentUser.userId !== message.arthur.userId && (
                <img
                  src={message.arthur.avatar || avatarImage}
                  className='w-9 h-9 rounded-full'
                />
              )}

              <div className='flex-col'>
                <div className='text-sm max-w-[240px] break-words	'>
                  {message.content}
                </div>
                <div className='flex items-center'>
                  <div className='text-xs text-slate-500 truncate max-w-[92px]'>
                    {message.arthur.name}・
                  </div>
                  <div className='text-xs text-slate-500'>
                    {formatTime(message.createdAt)}
                  </div>
                </div>
              </div>

              {currentUser.userId === message.arthur.userId && (
                <img
                  src={message.arthur.avatar || avatarImage}
                  className='w-9 h-9 rounded-full'
                />
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <ModalHeader className='py-3'>View Event</ModalHeader>
      <Divider />
      <ModalBody>
        <div className='flex items-center'>
          <div className='w-14 border-r-1 border-gray-500 mr-4'>Title</div>
          <div>{selectedEvent.title}</div>
        </div>
        <div className='flex items-center'>
          <div className='w-14 border-r-1 border-gray-500 mr-4'>Time</div>
          {renderTime()}
        </div>
        <div className='flex items-center'>
          <div className='w-14 border-r-1 border-gray-500 mr-4'>Tag</div>

          <div className='flex items-center gap-1'>
            <div
              className={clsx(
                'w-3 h-3 rounded-full',
                themeColors[Number(selectedEvent.tag)].bg,
              )}
            />
            <div>{calendarTags[Number(selectedEvent.tag)].name}</div>
          </div>
        </div>
        <div className='flex items-center'>
          <div className='w-14 border-r-1 border-gray-500 mr-4'>Note</div>
          <div>{selectedEvent.note}</div>
        </div>
        {!selectedEvent.isMemo && (
          <>
            <Divider />
            <div>Comments</div>
            <Divider />
            {renderComments()}
            <Divider />
            <div className='flex items-center gap-2'>
              <input
                className='border rounded-lg text-sm h-10 px-2 grow'
                placeholder='Add a comment'
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
              />
              <MaterialSymbolsSubdirectoryArrowLeftRounded
                className='w-5 h-5 hover:cursor-pointer'
                onClick={handleAddComment}
              />
            </div>

            <Divider />
          </>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onPress={handleEdit} className='w-1/2'>
          編輯
        </Button>
        <Button color='danger' onPress={handleDelete} className='w-1/2'>
          刪除
        </Button>
      </ModalFooter>
    </>
  );
};
