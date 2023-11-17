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
  const { isCreateModalOpen, setModalOpen } = useModalStore();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const handleStartDateChange = (date: Date) => {
    setStartDate(date);
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };

  const renderTags = () => {
    return (
      <Select className='max-w-xs w-full' size='sm' variant='bordered'>
        <SelectItem
          key='color1'
          startContent={
            <div className='w-4 h-4 rounded-full bg-amber-500'></div>
          }
        >
          color1
        </SelectItem>
        <SelectItem
          key='color2'
          startContent={
            <div className='w-4 h-4 rounded-full bg-lime-500'></div>
          }
        >
          color2
        </SelectItem>
        <SelectItem
          key='color3'
          startContent={<div className='w-4 h-4 rounded-full bg-sky-500'></div>}
        >
          color3
        </SelectItem>
      </Select>
    );
  };
  return (
    <>
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={(isOpen) => setModalOpen(isOpen, null)}
        size='lg'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='py-3'>New Event</ModalHeader>
              <Divider />
              <ModalBody>
                <Input type='text' variant='underlined' placeholder='Title' />
                <div className='flex items-center gap-2'>
                  <label className='w-12'>Time</label>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    // startDate={startDate}
                    // endDate={endDate}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='MMM dd, yyyy HH:mm'
                    className='border rounded-md h-8 w-40 text-center text-base'
                  />
                  <span>－</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    selectsEnd
                    // startDate={startDate}
                    // endDate={endDate}
                    minDate={startDate}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    timeCaption='Time'
                    dateFormat='MMM dd, yyyy HH:mm'
                    className='border rounded-md h-8 w-40 text-center text-base'
                  />
                </div>
                <Switch size='sm' className='pl-14'>
                  All-day
                </Switch>

                <div className='flex items-center gap-2'>
                  <label className='w-12'>Tag</label>
                  {renderTags()}
                </div>

                <div className='flex items-center gap-2'>
                  <label className='w-12'>Note</label>
                  <Input type='text' className='w-80' />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color='primary' onPress={onClose} className='w-1/2'>
                  送出
                </Button>
                <Button onPress={onClose} variant='bordered' className='w-1/2'>
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
