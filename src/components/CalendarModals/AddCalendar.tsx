import { Button, Modal, ModalContent } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { useModalStore } from '../../store/modalStore';
import { createNewCalendar } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';
import { CalendarInfo } from '../../utils/types';

export default function AddCalendar() {
  const { currentUser, setCurrentCalendarId, setCurrentCalendarContent } =
    useAuthStore();
  const { resetAllEvents } = useEventsStore();
  const { isAddCalendarModalOpen, setIsAddCalendarModalOpen } = useModalStore();
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
    name: "Pikachu's calendar",
    themeColor: '',
  });

  const updateCalendarInfo = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    let name: string, value: string;

    if (event.target instanceof HTMLInputElement) {
      name = event.target.name;
      value = event.target.value;
    } else if (event.target instanceof HTMLButtonElement) {
      name = event.currentTarget.name;
      value = event.currentTarget.value;
    }

    setCalendarInfo((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [borderColor, setBorderColor] = useState('border-slate-200');
  const [isSelected, setIsSelected] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleSubmit = () => {
    createNewCalendar(
      currentUser.email,
      currentUser.userId,
      calendarInfo.name,
      calendarInfo.themeColor,
      setCurrentCalendarId,
      setCurrentCalendarContent,
      resetAllEvents,
    );
    setIsAddCalendarModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isAddCalendarModalOpen}
        onOpenChange={(isOpen) => setIsAddCalendarModalOpen(isOpen)}
        size='4xl'
      >
        <ModalContent
          className={clsx(
            'flex flex-col justify-center items-center p-8 overflow-y-auto gap-10 border-[20px]',
            borderColor,
          )}
        >
          <div className='flex flex-col items-center gap-5 w-full'>
            <div className='text-2xl font-bold'>Name Your Calendar</div>
            <input
              name='name'
              className={clsx(
                'border-2 w-72 h-16 rounded-lg px-5 text-lg',
                borderColor,
              )}
              value={calendarInfo.name}
              onChange={updateCalendarInfo}
            />
          </div>
          <div className='flex flex-col items-center gap-5'>
            <div className='text-2xl font-bold'>Choose a Theme Color</div>
            <div className='flex gap-4'>
              {themeColors.map((color, index) => (
                <button
                  key={index}
                  className={clsx(
                    '-skew-x-12 bg-slate-200 w-12 h-48 rounded',
                    color.bg,
                    {
                      ['outline outline-3 outline-offset-2 outline-slate-500']:
                        isSelected[index],
                    },
                  )}
                  name='themeColor'
                  value={index}
                  onClick={(e) => {
                    setIsSelected((prevState) =>
                      prevState.map((_, idx) => (idx === index ? true : false)),
                    );
                    updateCalendarInfo(e);
                    setBorderColor(themeColors[index].border);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <Button
              color='default'
              className='w-32'
              disabled={!calendarInfo.name || !calendarInfo.themeColor}
              onClick={handleSubmit}
            >
              送出
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
