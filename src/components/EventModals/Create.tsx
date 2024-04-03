import { Modal, ModalContent } from '@nextui-org/react';
import { addMinutes } from 'date-fns';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { firebase } from '../../utils/firebase';
import { CreateEvent, Event, initialEvent } from '../../utils/types';
import { datePickerColors, renderModalContent } from './Common';

export default function Create() {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedStartDate,
    selectedEndDate,
    selectedIsAllDay,
  } = useModalStore();
  const { currentCalendarId, currentCalendarContent } = useAuthStore();

  const [eventDetail, setEventDetail] = useState<Event | CreateEvent>({
    ...initialEvent,
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEventDetail((prev) => ({
      ...prev,
      startAt: selectedStartDate,
      endAt: addMinutes(selectedStartDate, 15),
      isAllDay: selectedIsAllDay,
    }));
  }, [selectedStartDate]);

  const handleSubmit = async () => {
    const isTitleInvalid =
      !eventDetail.title || eventDetail.title.replace(/\s+/g, '').length === 0;
    if (isTitleInvalid) {
      toast.error('Event title can not be empty!');
      return;
    }

    setIsSaving(true);
    await firebase.modifyEvent(currentCalendarId, eventDetail);
    resetModal();
    setIsSaving(false);
  };

  const resetModal = () => {
    document.documentElement.style.setProperty(
      '--main-bg-color',
      datePickerColors[0],
    );
    setIsCreateModalOpen(false, new Date(), new Date(), false);
    setEventDetail(initialEvent);
  };

  return (
    <Modal
      isOpen={isCreateModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetModal();
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
          eventDetail,
          setEventDetail,
          isPopoverOpen,
          setIsPopoverOpen,
          currentCalendarContent,
          resetModal,
          handleSubmit,
          isSaving,
          true,
        )}
      </ModalContent>
    </Modal>
  );
}
