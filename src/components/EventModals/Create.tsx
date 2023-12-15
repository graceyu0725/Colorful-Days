import { Modal, ModalContent } from '@nextui-org/react';
import { addMinutes } from 'date-fns';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { Event, initialEvent } from '../../utils/types';
import {
  CreateEvent,
  datePickerColors,
  renderModalContent,
} from './CommonComponents';

export default function Create() {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedStartDate,
    selectedEndDate,
    selectedIsAllDay,
  } = useModalStore();
  const { currentCalendarId, currentCalendarContent } = useAuthStore();

  const [userInput, setUserInput] = useState<Event | CreateEvent>({
    ...initialEvent,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    setUserInput((prev) => ({
      ...prev,
      startAt: selectedStartDate,
      endAt: addMinutes(selectedStartDate, 15),
      isAllDay: selectedIsAllDay,
    }));
  }, [selectedStartDate, selectedEndDate]);

  // =====================================================
  // Handle button clicking
  // =====================================================

  const addEvent = async (id: string, data: object) => {
    const calendarRef = doc(db, 'Calendars', currentCalendarId);
    const eventRef = doc(calendarRef, 'events', id);
    await setDoc(eventRef, data);
    toast.success('Event added successfully');
  };

  const handleSubmit = async () => {
    if (!userInput.title) {
      setIsTitleEmpty(true);
      return;
    }

    if (userInput.title.replace(/\s+/g, '').length === 0) {
      setIsTitleEmpty(true);
      return;
    }

    const currentTime = serverTimestamp();
    const eventsCollection = collection(
      db,
      'Calendars',
      currentCalendarId,
      'events',
    );
    const eventRef = doc(eventsCollection);
    const eventUUID = eventRef.id;

    const data = {
      ...userInput,
      title: userInput.title.trim(),
      createdAt: currentTime,
      updatedAt: currentTime,
      eventId: eventUUID,
    };
    await addEvent(eventUUID, data);
    setUserInput(initialEvent);
    setIsCreateModalOpen(false, new Date(), new Date(), false);
  };

  const handleCancel = () => {
    setIsCreateModalOpen(false, new Date(), new Date(), false);
    setUserInput(initialEvent);
  };

  return (
    <>
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setUserInput(initialEvent);
            setIsTitleEmpty(false);
            document.documentElement.style.setProperty(
              '--main-bg-color',
              datePickerColors[0],
            );
          }
          setIsCreateModalOpen(
            isOpen,
            selectedStartDate,
            selectedEndDate,
            selectedIsAllDay,
          );
        }}
        size='lg'
      >
        <ModalContent className='max-h-[calc(100vh_-_130px)]'>
          {renderModalContent(
            isComposing,
            setIsComposing,
            'New Event',
            userInput,
            setUserInput,
            setIsTitleEmpty,
            isPopoverOpen,
            setIsPopoverOpen,
            currentCalendarContent,
            isTitleEmpty,
            handleCancel,
            handleSubmit,
            true,
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
