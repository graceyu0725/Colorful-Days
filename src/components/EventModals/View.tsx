import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import clsx from 'clsx';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from 'date-fns';
import { Timestamp, collection, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import FluentNotepad28Filled from '~icons/fluent/notepad-28-filled';
import MaterialSymbolsSubdirectoryArrowLeftRounded from '~icons/material-symbols/subdirectory-arrow-left-rounded';
import MdiTag from '~icons/mdi/tag';
import UisCommentDots from '~icons/uis/comment-dots';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { addNewComment } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';
import { defaultTags } from '../../utils/types';
import avatarImage from '../SideNavigation/avatar.png';

interface Props {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const View: React.FC<Props> = ({ setIsEditing }) => {
  const { selectedEvent, setIsEditModalOpen } = useModalStore();
  const { currentUser, currentCalendarId, currentCalendarContent } =
    useAuthStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedEvent.messages]);

  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const renderTime = () => {
    const startDate = selectedEvent.startAt
      ? selectedEvent.startAt
      : new Date();
    const endDate = selectedEvent.endAt ? selectedEvent.endAt : new Date();

    if (selectedEvent.isMemo) {
      return <div>Memo</div>;
    }

    if (selectedEvent.isAllDay) {
      const startDateYear = format(startDate, 'LLL dd, yyyy');
      const startTime = format(startDate, 'E');
      const endDateYear = format(endDate, 'LLL dd, yyyy');
      const endTime = format(endDate, 'E');

      return (
        <div className='flex gap-6 items-center justify-center'>
          <div className='flex flex-col'>
            <div className='text-base'>{startTime}</div>
            <div className='text-xl'>{startDateYear}</div>
          </div>
          <div
            className={clsx(
              'w-5 h-5 border-t-5 border-r-5 rounded rotate-45',
              themeColors[Number(selectedEvent.tag)].border,
            )}
          />
          <div className='flex flex-col'>
            <div className='text-base'>{endTime}</div>
            <div className='text-xl'>{endDateYear}</div>
          </div>
        </div>
      );
    }

    const startDay = format(startDate, 'E, LLL dd yyyy');
    const startTime = format(startDate, 'HH:mm');
    const endDay = format(endDate, 'E, LLL dd yyyy');
    const endTime = format(endDate, 'HH:mm');

    return (
      <div className='flex gap-6 items-center justify-center'>
        <div className='flex flex-col'>
          <div className='text-base'>{startDay}</div>
          <div className='text-xl'>{startTime}</div>
        </div>
        <div
          className={clsx(
            'w-5 h-5 border-t-5 border-r-5 rounded rotate-45',
            themeColors[Number(selectedEvent.tag)].border,
          )}
        />
        <div className='flex flex-col'>
          <div className='text-base'>{endDay}</div>
          <div className='text-xl'>{endTime}</div>
        </div>
      </div>
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
    setIsEditModalOpen(false, selectedEvent);

    toast.success('Event deleted successfully!');
  };

  const calendarTags = currentCalendarContent.tags || defaultTags;

  const [commentInput, setCommentInput] = useState('');
  const handleAddComment = () => {
    addNewComment(
      currentCalendarId,
      selectedEvent.eventId.toString(),
      currentUser,
      commentInput,
    );
    setCommentInput('');
  };

  const formatTime = (time: Timestamp | null) => {
    const originTime = time?.toDate() || new Date();
    const now = new Date();

    const secondsDiff = differenceInSeconds(now, originTime);
    const minutesDiff = differenceInMinutes(now, originTime);
    const hoursDiff = differenceInHours(now, originTime);
    const daysDiff = differenceInDays(now, originTime);

    if (secondsDiff < 30) return 'just now';
    if (secondsDiff < 120) return '1 min ago';
    if (minutesDiff < 45) return `${minutesDiff} mins ago`;
    if (minutesDiff < 120) return '1 hr ago';
    if (hoursDiff < 24) return `${hoursDiff} hrs ago`;
    if (hoursDiff < 48) return '1 day ago';
    if (daysDiff < 30) return `${daysDiff} days ago`;
    if (daysDiff < 45) return '1 month ago';
    if (daysDiff >= 45) return format(originTime, 'LLL dd, yyyy');
  };

  const renderComments = () => {
    return (
      <div className='h-40 flex flex-col gap-2 overflow-y-auto px-1'>
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
              {currentUser.userId === message.arthur.userId ? (
                <>
                  <div className='flex items-end gap-2'>
                    <div className='text-xs w-24 text-slate-500 text-right'>
                      {formatTime(message.createdAt)}
                    </div>
                    <div className='flex flex-col items-end'>
                      <div className='px-px text-xs text-slate-500 truncate max-w-[92px] text-right'>
                        {message.arthur.name}
                      </div>
                      <div
                        className={clsx(
                          'text-sm max-w-[200px] min-h-[28px] px-2 leading-7 break-words rounded-lg',
                          themeColors[Number(selectedEvent.tag)]
                            .lightBackground,
                        )}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                  <img
                    src={message.arthur.avatar || avatarImage}
                    className='w-11 h-11 rounded-full'
                  />
                </>
              ) : (
                <>
                  <img
                    src={message.arthur.avatar || avatarImage}
                    className='w-11 h-11 rounded-full'
                  />
                  <div className='flex flex-col'>
                    <div className='px-px text-xs text-slate-500 truncate max-w-[92px]'>
                      {message.arthur.name}
                    </div>
                    <div className='flex items-end gap-2'>
                      <div className='text-sm max-w-[200px] min-h-[28px] px-2 leading-7 break-words bg-slate-100 rounded-lg'>
                        {message.content}
                      </div>
                      <div className='text-xs w-24 text-slate-500'>
                        {formatTime(message.createdAt)}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };

  return (
    <>
      <ModalHeader className='py-3'>View Event</ModalHeader>
      <Divider />
      <ModalBody className='pt-3'>
        <div className='flex items-center px-2'>
          <div
            className={clsx(
              'w-full text-2xl break-words text-center',
              themeColors[Number(selectedEvent.tag)].text,
            )}
          >
            {selectedEvent.title}
          </div>
        </div>

        <div className='flex items-center justify-center px-2 gap-1 text-sm'>
          <MdiTag
            className={clsx(themeColors[Number(selectedEvent.tag)].text)}
          />
          <div className='leading-4'>
            {calendarTags[Number(selectedEvent.tag)].name}
          </div>
        </div>

        <div className='flex items-center justify-center text-lg'>
          {renderTime()}
        </div>

        {selectedEvent.note && (
          <>
            <Divider />
            <div className='flex items-start gap-5'>
              <div className='flex items-center gap-1'>
                <FluentNotepad28Filled
                  className={clsx(themeColors[Number(selectedEvent.tag)].text)}
                />
                <div>Note</div>
              </div>
              <div
                className={clsx(
                  'w-4/5 break-words rounded-lg whitespace-pre-line',
                )}
              >
                {selectedEvent.note}
              </div>
            </div>
          </>
        )}

        <Divider />
        <div className='flex items-center gap-1'>
          <UisCommentDots
            className={clsx(themeColors[Number(selectedEvent.tag)].text)}
          />
          <div>Comments</div>
        </div>
        <Divider />
        {renderComments()}
        <div className='flex items-center gap-2'>
          <input
            className={clsx(
              'border rounded-lg text-sm h-10 leading-10 px-2 grow',
              themeColors[Number(selectedEvent.tag)].outline,
            )}
            placeholder='Add a comment'
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isComposing) {
                handleAddComment();
              }
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
          <MaterialSymbolsSubdirectoryArrowLeftRounded
            className={clsx(
              'w-5 h-5 hover:cursor-pointer',
              themeColors[Number(selectedEvent.tag)].text,
            )}
            onClick={handleAddComment}
          />
        </div>
        <Divider />
      </ModalBody>

      <ModalFooter className='flex items-center pt-1'>
        <div className='w-full flex gap-2'>
          <Button
            variant='bordered'
            onPress={handleDelete}
            className='w-1/2 text-red-500'
          >
            Delete
          </Button>
          <Button
            color='primary'
            onPress={handleEdit}
            className={clsx(
              'w-1/2',
              themeColors[Number(selectedEvent.tag)].darkBackground,
            )}
          >
            Edit
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};
