import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Switch,
} from '@nextui-org/react';
import clsx from 'clsx';
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { themeColors } from '../../utils/theme';
import { Event, defaultTags } from '../../utils/types';
import { View } from './View';

export default function Edit() {
  const { isEditModalOpen, setIsEditModalOpen, selectedEvent } =
    useModalStore();
  const { currentCalendarId, currentCalendarContent } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [userInput, setUserInput] = useState<Event>(selectedEvent);

  useEffect(() => {
    setUserInput(selectedEvent);
  }, [selectedEvent]);

  const updateUserInput = (label: keyof Event, value: any) => {
    setUserInput((prev) => {
      if (prev[label] === value) {
        return prev;
      }
      const updatedInput = { ...prev, [label]: value };
      if (
        label === 'startAt' &&
        updatedInput.endAt &&
        value > updatedInput.endAt
      ) {
        updatedInput.endAt = value;
      }
      if (label === 'isAllDay' || label === 'isMemo') {
        updatedInput[label] = !prev[label];
      }
      return updatedInput;
    });
  };

  // =====================================================
  // Handle rendering
  // =====================================================

  const calendarTags = currentCalendarContent.tags || defaultTags;
  const renderTags = () => {
    return (
      <Select
        className='max-w-xs w-full'
        size='sm'
        variant='bordered'
        aria-label='selectColor'
        onChange={(e) => {
          setUserInput((prev) => ({ ...prev, tag: e.target.value }));
        }}
        value={userInput.tag}
        placeholder={calendarTags[Number(userInput.tag)].name}
        renderValue={() => (
          <div className='flex items-center gap-1'>
            <div
              className={clsx(
                'w-3 h-3 rounded-full',
                themeColors[Number(userInput.tag)].bg,
              )}
            />
            <div>{calendarTags[Number(userInput.tag)].name}</div>
          </div>
        )}
      >
        {calendarTags.map((tag, index) => (
          <SelectItem
            key={tag.colorCode}
            value={tag.colorCode}
            startContent={
              <div
                className={clsx('w-4 h-4 rounded-full', themeColors[index].bg)}
              ></div>
            }
          >
            {tag.name}
          </SelectItem>
        ))}
      </Select>
    );
  };

  const renderDatePicker = (type: string) => {
    if (type === 'allDay') {
      return (
        <div className='flex items-center gap-2'>
          <label className='w-12'>Time</label>
          <DatePicker
            aria-label='startDate'
            selected={userInput.startAt}
            selectsStart
            dateFormat='MMM dd, yyyy'
            className='border rounded-md h-8 w-40 text-center text-base'
            onChange={(e) => updateUserInput('startAt', e)}
          />
          <span>－</span>
          <DatePicker
            aria-label='endDate'
            selected={userInput.endAt}
            selectsEnd
            minDate={userInput.startAt}
            dateFormat='MMM dd, yyyy'
            className='border rounded-md h-8 w-40 text-center text-base'
            onChange={(e) => updateUserInput('endAt', e)}
          />
        </div>
      );
    } else if (type === 'memo') {
      return <></>;
    }

    return (
      <div className='flex items-center gap-2'>
        <label className='w-12'>Time</label>
        <DatePicker
          aria-label='startDate'
          selected={userInput.startAt}
          selectsStart
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='MMM dd, yyyy HH:mm'
          className='border rounded-md h-8 w-40 text-center text-base'
          onChange={(e) => updateUserInput('startAt', e)}
        />
        <span>－</span>
        <DatePicker
          aria-label='endDate'
          selected={userInput.endAt}
          selectsEnd
          minDate={userInput.startAt}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='MMM dd, yyyy HH:mm'
          className='border rounded-md h-8 w-40 text-center text-base'
          onChange={(e) => updateUserInput('endAt', e)}
        />
      </div>
    );
  };

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

  const handleSubmit = () => {
    const currentTime = serverTimestamp();
    const data = {
      ...userInput,
      updatedAt: currentTime,
    };
    updateEvent(data);
    setIsEditModalOpen(false, userInput);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <>
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={(isOpen) => setIsEditModalOpen(isOpen, userInput)}
        size='lg'
      >
        <ModalContent>
          {!isEditing ? (
            <View setIsEditing={setIsEditing} />
          ) : (
            <>
              <ModalHeader className='py-3'>Update Event</ModalHeader>
              <Divider />
              <ModalBody>
                <Input
                  isReadOnly={!isEditing}
                  aria-label='title'
                  type='text'
                  variant='underlined'
                  placeholder='Title'
                  value={userInput.title}
                  onChange={(e) => updateUserInput('title', e.target.value)}
                />
                {userInput.isAllDay &&
                  !userInput.isMemo &&
                  renderDatePicker('allDay')}
                {userInput.isMemo && renderDatePicker('memo')}
                {!userInput.isAllDay &&
                  !userInput.isMemo &&
                  renderDatePicker('normal')}

                {!userInput.isMemo && (
                  <Switch
                    size='sm'
                    className='pl-14'
                    aria-label='allDay'
                    isSelected={userInput.isAllDay}
                    onChange={(e) => updateUserInput('isAllDay', e)}
                  >
                    All-day
                  </Switch>
                )}

                <Switch
                  size='sm'
                  className='pl-14'
                  aria-label='saveAsMemo'
                  isSelected={userInput.isMemo}
                  onChange={(e) => updateUserInput('isMemo', e)}
                >
                  Save as memo
                </Switch>

                <div className='flex items-center gap-2'>
                  <label className='w-12'>Tag</label>
                  {renderTags()}
                </div>

                <div className='flex items-center gap-2'>
                  <label className='w-12'>Note</label>
                  <Input
                    type='text'
                    className='w-80'
                    aria-label='note'
                    value={userInput.note}
                    onChange={(e) => updateUserInput('note', e.target.value)}
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color='primary'
                  onPress={handleSubmit}
                  className='w-1/2'
                >
                  送出
                </Button>
                <Button
                  variant='bordered'
                  onPress={handleCancel}
                  className='w-1/2'
                >
                  取消
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
