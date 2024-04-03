import { Button, Modal, ModalContent } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { createNewCalendar } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';

const MAX_NAME_LENGTH = 30;

const getInitialUserSelection = () => {
  return {
    calendarName: '',
    calendarThemeColor: '',
    borderColor: 'border-slate-200',
    backgroundColor: 'bg-slate-200',
    buttonIndex: 99,
  };
};

export default function AddCalendar() {
  const { currentUser } = useAuthStore();
  const { isAddCalendarModalOpen, setIsAddCalendarModalOpen } = useModalStore();

  const [userSelection, setUserSelection] = useState(getInitialUserSelection());
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateCalendarName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_NAME_LENGTH) return;

    setUserSelection((prev) => ({
      ...prev,
      calendarName: e.target.value,
    }));
  };

  const updateSelectedTheme = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => {
    const target = e.target as HTMLButtonElement;
    setUserSelection((prev) => ({
      ...prev,
      calendarThemeColor: target.value,
      borderColor: themeColors[index].border,
      backgroundColor: themeColors[index].background,
      buttonIndex: index,
    }));
  };

  const handleAddNewCalendar = async () => {
    setIsLoading(true);

    const isNameInvalid =
      !userSelection.calendarName ||
      userSelection.calendarName.replace(/\s+/g, '').length === 0;

    if (isNameInvalid) {
      toast.error('Calendar name can not be empty!');
      setIsLoading(false);
      return;
    }

    if (!userSelection.calendarThemeColor) {
      toast.error('Please select a theme color!');
      setIsLoading(false);
      return;
    }

    await createNewCalendar(
      currentUser.email,
      currentUser.userId,
      userSelection.calendarName.trim(),
      userSelection.calendarThemeColor,
    );

    setIsAddCalendarModalOpen(false);
    setUserSelection(getInitialUserSelection());
    toast.success('Calendar added successfully');
    setIsLoading(false);
  };

  return (
    <Modal
      isOpen={isAddCalendarModalOpen}
      onOpenChange={(isOpen) => {
        setIsAddCalendarModalOpen(isOpen);
        if (!isOpen) {
          setUserSelection(getInitialUserSelection());
        }
      }}
      size='4xl'
    >
      <ModalContent
        className={clsx(
          'max-h-[calc(100vh_-_120px)] flex flex-col justify-center items-center p-8 overflow-y-auto gap-6 border-[30px] transition-colors',
          userSelection.borderColor,
        )}
      >
        <div className='h-2/3 flex flex-col items-center gap-5 min-h-fit w-full'>
          <div className='text-2xl font-bold'>Name Your Calendar</div>
          <input
            className={clsx(
              'border-2 w-80 sm:w-96 h-16 leading-[64px] rounded-lg px-5 text-lg focus:outline-none',
              userSelection.borderColor,
            )}
            value={userSelection.calendarName}
            onChange={(e) => updateCalendarName(e)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isComposing) {
                handleAddNewCalendar();
              }
            }}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
          />
        </div>

        <div className='flex flex-col items-center gap-5 h-1/3 w-full'>
          <div className='text-2xl font-bold'>Choose a Theme Color</div>
          <div className='flex justify-center gap-2.5 md:gap-4 h-full w-full'>
            {themeColors.map((color, index) => (
              <button
                key={index}
                className={clsx(
                  '-skew-x-6 md:-skew-x-12 bg-slate-200 w-8 sm:w-12 h-full min-h-[140px] max-h-[192px] rounded',
                  color.background,
                  {
                    ['outline outline-3 outline-offset-2 outline-slate-300']:
                      index === userSelection.buttonIndex,
                  },
                )}
                value={index}
                onClick={(e) => updateSelectedTheme(e, index)}
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
              userSelection.backgroundColor,
            )}
            onClick={handleAddNewCalendar}
          >
            Submit
          </Button>
        </div>
      </ModalContent>
    </Modal>
  );
}
