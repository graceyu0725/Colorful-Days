import { Modal, ModalContent } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { firebase } from '../../utils/firebase';
import { Event } from '../../utils/types';
import { datePickerColors, renderModalContent } from './Common';
import { View } from './View';

export default function Edit() {
  const { isEditModalOpen, setIsEditModalOpen, selectedEvent } =
    useModalStore();
  const { currentCalendarId, currentCalendarContent } = useAuthStore();
  const getInitialEventDetail = (): Event => {
    return {
      ...selectedEvent,
      startAt: selectedEvent.startAt || new Date(),
      endAt: selectedEvent.endAt || new Date(),
    };
  };
  const [eventDetail, setEventDetail] = useState<Event>(
    getInitialEventDetail(),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEventDetail(getInitialEventDetail());
    document.documentElement.style.setProperty(
      '--main-bg-color',
      datePickerColors[Number(selectedEvent.tag)],
    );
  }, [selectedEvent]);

  const handleSubmit = async () => {
    const isTitleInvalid =
      !eventDetail.title || eventDetail.title.replace(/\s+/g, '').length === 0;
    if (isTitleInvalid) {
      toast.error('Event title can not be empty!');
      return;
    }

    setIsSaving(true);
    await firebase.modifyEvent(
      currentCalendarId,
      eventDetail,
      selectedEvent.eventId.toString(),
    );

    setIsEditModalOpen(false, eventDetail);
    setIsEditing(false);
    setIsSaving(false);
  };

  const resetModal = () => {
    document.documentElement.style.setProperty(
      '--main-bg-color',
      datePickerColors[0],
    );
    setEventDetail(getInitialEventDetail());
    setIsEditing(false);
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetModal();
        }
        setIsEditModalOpen(isOpen, eventDetail);
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
            eventDetail,
            setEventDetail,
            isPopoverOpen,
            setIsPopoverOpen,
            currentCalendarContent,
            resetModal,
            handleSubmit,
            isSaving,
            isEditing,
          )
        )}
      </ModalContent>
    </Modal>
  );
}
