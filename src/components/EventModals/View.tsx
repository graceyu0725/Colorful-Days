import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { themeColors } from '../../utils/theme';
import { defaultTags, initialEvent } from '../../utils/types';

interface Props {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

export const View: React.FC<Props> = ({ setIsEditing }) => {
  const { selectedEvent, setIsEditModalOpen } = useModalStore();
  const { currentCalendarId, currentCalendarContent } = useAuthStore();

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
