import { Modal, ModalContent } from '@nextui-org/react';
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { datePickerColors, renderModalContent } from './CommonComponents';
import { View } from './View';

export default function Edit() {
  const { isEditModalOpen, setIsEditModalOpen, selectedEvent } =
    useModalStore();
  const { currentCalendarId, currentCalendarContent } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userInput, setUserInput] = useState(selectedEvent);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUserInput({
      ...selectedEvent,
      startAt: selectedEvent.startAt || new Date(),
      endAt: selectedEvent.endAt || new Date(),
    });
  }, [selectedEvent]);

  // =====================================================
  // Handle button clicking
  // =====================================================

  const updateEvent = async (data: object) => {
    const eventsCollection = collection(
      db,
      'Calendars',
      currentCalendarId,
      'events',
    );
    const eventRef = doc(eventsCollection, selectedEvent.eventId.toString());
    await updateDoc(eventRef, data);
  };

  const handleSubmit = async () => {
    if (!userInput.title) {
      setIsTitleEmpty(true);
      return;
    }

    setIsSaving(true);
    const currentTime = serverTimestamp();
    const data = {
      ...userInput,
      updatedAt: currentTime,
    };
    await updateEvent(data);
    setIsEditModalOpen(false, userInput);
    setIsEditing(false);
    setIsSaving(false);
    toast.success('Event updated successfully');
  };

  const handleCancel = () => {
    setUserInput({
      ...selectedEvent,
      startAt: selectedEvent.startAt || new Date(),
      endAt: selectedEvent.endAt || new Date(),
    });
    setIsEditing(false);
  };

  return (
    <>
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsEditing(false);
            setUserInput(selectedEvent);
            setIsTitleEmpty(false);
            document.documentElement.style.setProperty(
              '--main-bg-color',
              datePickerColors[Number(selectedEvent.tag)],
            );
          }
          setIsEditModalOpen(isOpen, userInput);
        }}
        size='lg'
      >
        <ModalContent className='max-h-[calc(100vh_-_130px)]'>
          {!isEditing ? (
            <View setIsEditing={setIsEditing} />
          ) : (
            renderModalContent(
              isComposing,
              setIsComposing,
              'Update Event',
              userInput,
              setUserInput,
              setIsTitleEmpty,
              isPopoverOpen,
              setIsPopoverOpen,
              currentCalendarContent,
              isTitleEmpty,
              handleCancel,
              handleSubmit,
              isSaving,
              isEditing,
            )
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
