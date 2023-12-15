import { Button, Modal, ModalContent } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
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
    name: ``,
    themeColor: '',
  });
  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const [isNameValid, setIsNameValid] = useState(true);
  const updateCalendarInfo = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    let name: string = '';
    let value: string = '';

    if (event.target instanceof HTMLInputElement) {
      name = event.target.name;
      value = event.target.value;
    } else if (event.target instanceof HTMLButtonElement) {
      name = event.currentTarget.name;
      value = event.currentTarget.value;
    }

    if (name === 'name' && value.length > 30) {
      setIsNameValid(false);
      return;
    }
    if (name === 'name' && value.length <= 30) {
      setIsNameValid(true);
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

    if (calendarInfo.name.replace(/\s+/g, '').length === 0) {
      toast.error('Calendar name can not be empty!');
      setIsLoading(false);
      return;
    }

    await createNewCalendar(
      currentUser.email,
      currentUser.userId,
      calendarInfo.name.trim(),
      calendarInfo.themeColor,
      setCurrentCalendarId,
      setCurrentCalendarContent,
      resetAllEvents,
    );
    setIsAddCalendarModalOpen(false);
    resetInfo();
    setIsLoading(false);

    toast.success('Calendar added successfully');
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
            'max-h-[calc(100vh_-_200px)] flex flex-col justify-center items-center p-8 overflow-y-auto gap-10 border-[30px] transition-colors',
            borderColor,
          )}
        >
          <div className='h-2/3 flex flex-col items-center gap-5 min-h-fit w-full'>
            <div className='text-2xl font-bold'>Name Your Calendar</div>
            <input
              name='name'
              className={clsx(
                'border-2 w-80 sm:w-96 h-16 leading-[64px] rounded-lg px-5 text-lg focus:outline-none',
                borderColor,
              )}
              value={calendarInfo.name}
              onChange={updateCalendarInfo}
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  !isComposing &&
                  calendarInfo.name &&
                  calendarInfo.themeColor
                ) {
                  handleSubmit();
                }
              }}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
            />
            {!isNameValid && (
              <div className='text-sm text-red-500 -mt-3 -mb-7'>
                Maximum length of calendar name is 30 characters.
              </div>
            )}
          </div>
          <div className='flex flex-col items-center gap-5 h-1/3 w-full'>
            <div className='text-2xl font-bold'>Choose a Theme Color</div>
            <div className='flex justify-center gap-2.5 md:gap-4 h-full w-full'>
              {themeColors.map((color, index) => (
                <button
                  key={index}
                  className={clsx(
                    '-skew-x-6 md:-skew-x-12 bg-slate-200 w-8 sm:w-12 h-full min-h-[160px] max-h-[192px] rounded',
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
