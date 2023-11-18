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
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useModalStore } from '../../store/modalStore';

export default function Create() {
  const { isCreateModalOpen, setIsCreateModalOpen } = useModalStore();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const colors = [
    { color: 'blue', name: 'work' },
    { color: 'orange', name: 'study' },
    { color: 'green', name: 'travel' },
  ];

  interface EventMessages {
    arthur: object;
    content: string;
    createdAt: Date | null;
  }

  interface Input {
    title: string;
    startAt: Date | null;
    endAt: Date | null;
    isAllDay: boolean;
    isMemo: boolean;
    tag: string | undefined;
    note: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    messages: EventMessages[];
  }

  const initialInput: Input = {
    title: '',
    startAt: startDate,
    endAt: endDate,
    isAllDay: false,
    isMemo: false,
    tag: undefined,
    note: '',
    createdAt: null,
    updatedAt: null,
    messages: [],
  };

  const [userInput, setUserInput] = useState(initialInput);

  const updateUserInput = (label: string, value: any) => {
    setUserInput({ ...userInput, [label]: value });
    if (label === 'startAt') {
      setStartDate(value);
      if (endDate && value > endDate) {
        setEndDate(value);
      }
    }
    if (label === 'endAt') {
      setEndDate(value);
    }
  };

  // =====================================================
  // Handle rendering
  // =====================================================

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
      >
        <SelectItem
          key={0}
          value={0}
          startContent={
            <div className='w-4 h-4 rounded-full bg-amber-500'></div>
          }
        >
          color1
        </SelectItem>
        <SelectItem
          key={1}
          value={1}
          startContent={
            <div className='w-4 h-4 rounded-full bg-lime-500'></div>
          }
        >
          color2
        </SelectItem>
        <SelectItem
          key={2}
          value={2}
          startContent={<div className='w-4 h-4 rounded-full bg-sky-500'></div>}
        >
          color3
        </SelectItem>
      </Select>
    );
  };

  console.log(userInput);

  const renderDatePicker = (type: string) => {
    if (type === 'allDay') {
      return (
        <div className='flex items-center gap-2'>
          <label className='w-12'>Time</label>
          <DatePicker
            aria-label='startDate'
            selected={startDate}
            selectsStart
            dateFormat='MMM dd, yyyy'
            className='border rounded-md h-8 w-40 text-center text-base'
            onChange={(e) => updateUserInput('startAt', e)}
          />
          <span>－</span>
          <DatePicker
            aria-label='endDate'
            selected={endDate}
            selectsEnd
            minDate={startDate}
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
          selected={startDate}
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
          selected={endDate}
          selectsEnd
          minDate={startDate}
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
  const handleSubmit = () => {
    const currentTime = new Date();
    console.log(currentTime);
    const data = {
      ...userInput,
      createdAt: currentTime,
      updatedAt: currentTime,
    };
    console.log(data);
    setUserInput(initialInput);
    setIsCreateModalOpen(false, null);
  };

  return (
    <>
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={(isOpen) => setIsCreateModalOpen(isOpen, null)}
        size='lg'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='py-3'>New Event</ModalHeader>
              <Divider />
              <ModalBody>
                <Input
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

                {/* <div className='flex items-center gap-2'>
                  <label className='w-12'>Time</label>
                  <DatePicker
                    aria-label='startDate'
                    selected={startDate}
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
                    selected={endDate}
                    selectsEnd
                    minDate={startDate}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='MMM dd, yyyy HH:mm'
                    className='border rounded-md h-8 w-40 text-center text-base'
                    onChange={(e) => updateUserInput('endAt', e)}
                  />
                </div> */}

                {!userInput.isMemo && (
                  <Switch
                    size='sm'
                    className='pl-14'
                    aria-label='allDay'
                    isSelected={userInput.isAllDay}
                    onChange={() => {
                      setUserInput((prev) => ({
                        ...prev,
                        isAllDay: !prev.isAllDay,
                      }));
                    }}
                  >
                    All-day
                  </Switch>
                )}

                <Switch
                  size='sm'
                  className='pl-14'
                  aria-label='saveAsMemo'
                  isSelected={userInput.isMemo}
                  onChange={() => {
                    setUserInput((prev) => ({
                      ...prev,
                      isMemo: !prev.isMemo,
                    }));
                  }}
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
                  onPress={() => {
                    // onClose;
                    setUserInput(initialInput);
                    handleSubmit();
                  }}
                  className='w-1/2'
                >
                  送出
                </Button>
                <Button
                  variant='bordered'
                  onPress={() => {
                    setIsCreateModalOpen(false, null);
                    // setUserInput(initialInput);
                  }}
                  // onPress={onClose}
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
