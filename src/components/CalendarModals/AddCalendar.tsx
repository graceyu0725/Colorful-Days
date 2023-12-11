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
import toast from 'react-hot-toast';

export default function AddCalendar() {
  const { currentUser, setCurrentCalendarId, setCurrentCalendarContent } =
    useAuthStore();
  const { resetAllEvents } = useEventsStore();
  const { isAddCalendarModalOpen, setIsAddCalendarModalOpen } = useModalStore();
  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
    name: '',
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
  const [backgroundColor, setBackgroundColor] = useState('bg-slate-200');
  const [isSelected, setIsSelected] = useState(Array(8).fill(false));
  const [isLoading, setIsLoading] = useState(false);

  const resetInfo = () => {
    setCalendarInfo({
      name: '',
      themeColor: '',
    });
    setBorderColor('border-slate-200');
    setBackgroundColor('bg-slate-200');
    setIsSelected(Array(8).fill(false));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await createNewCalendar(
      currentUser.email,
      currentUser.userId,
      calendarInfo.name,
      calendarInfo.themeColor,
      setCurrentCalendarId,
      setCurrentCalendarContent,
      resetAllEvents,
    );
    setIsAddCalendarModalOpen(false);
    resetInfo();
    setIsLoading(false);

    toast.success('Calendar added successfully!', {
      style: {
        border: '1px solid #7a615a',
        padding: '8px',
        color: '#7a615a',
      },
      iconTheme: {
        primary: '#7a615a',
        secondary: '#FFFAEE',
      },
    });
  };

  return (
    <>
      <Modal
        isOpen={isAddCalendarModalOpen}
        onOpenChange={(isOpen) => {
          setIsAddCalendarModalOpen(isOpen);
          if (!isOpen) {
            resetInfo();
          }
        }}
        size='4xl'
      >
        <ModalContent
          className={clsx(
            'flex flex-col justify-center items-center p-8 overflow-y-auto gap-10 border-[30px] transition-colors',
            borderColor,
          )}
        >
          <div className='flex flex-col items-center gap-5 w-full'>
            <div className='text-2xl font-bold'>Name Your Calendar</div>
            <input
              name='name'
              className={clsx(
                'border-2 w-72 h-16 leading-[64px] rounded-lg px-5 text-lg focus:outline-none',
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
                    color.background,
                    {
                      ['outline outline-3 outline-offset-2 outline-slate-300']:
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
                    setBackgroundColor(themeColors[index].background);
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <Button
              isLoading={isLoading}
              color='default'
              className={clsx(
                'w-32 text-slate-700 text-base transition-colors',
                backgroundColor,
              )}
              disabled={!calendarInfo.name || !calendarInfo.themeColor}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}
