import { Button, Card } from '@nextui-org/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { firebase } from '../../utils/firebase';
import { addUserForGoogle } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';

export default function SelectTheme() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to='/signin' replace />;

  const MAX_NAME_LENGTH = 30;
  const getInitialUserSelection = () => {
    return {
      calendarName: `${state.userInfo.name}'s Calendar`,
      calendarThemeColor: '',
      borderColor: 'border-slate-200',
      backgroundColor: 'bg-slate-200',
      buttonIndex: 99,
    };
  };
  const [userSelection, setUserSelection] = useState(getInitialUserSelection());
  const [isComposing, setIsComposing] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const updateCalendarName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > MAX_NAME_LENGTH) return;
    setUserSelection((prev) => ({
      ...prev,
      calendarName: e.target.value,
    }));
  };

  const changeSelectedTheme = (
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

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    const isNameInvalid =
      !userSelection.calendarName ||
      userSelection.calendarName.replace(/\s+/g, '').length === 0;

    if (isNameInvalid) {
      toast.error('Calendar name can not be empty!');
      setIsButtonLoading(false);
      return;
    }

    if (!userSelection.calendarThemeColor) {
      toast.error('Please select a theme color!');
      setIsButtonLoading(false);
      return;
    }

    const validCalendarInfo = {
      name: userSelection.calendarName.trim(),
      themeColor: userSelection.calendarThemeColor,
    };

    state.isNativeSignup
      ? await firebase.signUp(state.userInfo, navigate, validCalendarInfo)
      : await addUserForGoogle(state.userInfo, navigate, validCalendarInfo);

    setIsButtonLoading(false);
  };

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-center h-screen bg-cover bg-slate-200 transition-colors',
          userSelection.backgroundColor,
        )}
      >
        <motion.div
          className='w-10/12 h-3/4'
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          <Card className='w-full h-full p-0 rounded-2xl flex flex-col items-center justify-center gap-10 z-10 overflow-visible'>
            <div className='flex flex-col items-center gap-5 min-h-fit w-full'>
              <div className='text-2xl font-bold'>Name Your Calendar</div>
              <input
                name='name'
                className={clsx(
                  'leading-[64px] border-2 w-72 xs:w-80 sm:w-96 h-16 rounded-lg px-5 text-lg focus:outline-none',
                  userSelection.borderColor,
                )}
                value={userSelection.calendarName}
                onChange={(e) => updateCalendarName(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isComposing) {
                    handleSubmit();
                  }
                }}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
              />
            </div>
            <div className='flex flex-col items-center gap-5 h-1/3 w-full'>
              <div className='text-2xl font-bold'>Choose a Theme Color</div>
              <div className='flex justify-center gap-2 xs:gap-2.5 md:gap-4 h-full w-full'>
                {themeColors.map((color, index) => (
                  <button
                    key={index}
                    className={clsx(
                      '-skew-x-6 md:-skew-x-12 bg-slate-200 w-7 xs:w-8 sm:w-12 h-full min-h-[80px] max-h-[192px] rounded',
                      color.background,
                      {
                        ['outline outline-3 outline-offset-2 outline-slate-300']:
                          index === userSelection.buttonIndex,
                      },
                    )}
                    name='themeColor'
                    value={index}
                    onClick={(e) => changeSelectedTheme(e, index)}
                  />
                ))}
              </div>
            </div>
            <Button
              isLoading={isButtonLoading}
              color='default'
              className={clsx(
                'w-32 text-slate-700 text-base transition-colors min-h-[40px]',
                userSelection.backgroundColor,
              )}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Card>
        </motion.div>
      </div>
    </>
  );
}
