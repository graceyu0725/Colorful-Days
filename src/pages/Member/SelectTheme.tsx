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
import { CalendarInfo } from '../../utils/types';

export default function SelectTheme() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to='/signin' replace />;

  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
    name: `${state.userInfo.name}'s Calendar`,
    themeColor: '',
  });
  const [isNameValid, setIsNameValid] = useState(true);

  // Update userInput when typing
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
  const [backgroundColor, setBackgroundColor] = useState('bg-slate-200');
  const [borderColor, setBorderColor] = useState('border-slate-200');

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleSubmit = async () => {
    setIsButtonLoading(true);

    if (calendarInfo.name.replace(/\s+/g, '').length === 0) {
      toast.error('Calendar name can not be empty!');
      setIsButtonLoading(false);
      return;
    }

    const validCalendarInfo = {
      ...calendarInfo,
      name: calendarInfo.name.trim(),
    };

    state.isNativeSignup
      ? await firebase.signUp(state.userInfo, navigate, validCalendarInfo)
      : await addUserForGoogle(state.userInfo, navigate, validCalendarInfo);
    setIsButtonLoading(false);
  };

  const [isComposing, setIsComposing] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const changeSelectedTheme = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
  ) => {
    setIsSelected((prevState) => prevState.map((_, idx) => idx === index));
    updateCalendarInfo(e);
    setBackgroundColor(themeColors[index].background);
    setBorderColor(themeColors[index].border);
  };

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-center h-screen bg-cover bg-slate-200 transition-colors',
          backgroundColor,
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
              <div className='flex justify-center gap-2 xs:gap-2.5 md:gap-4 h-full w-full'>
                {themeColors.map((color, index) => (
                  <button
                    key={index}
                    className={clsx(
                      '-skew-x-6 md:-skew-x-12 bg-slate-200 w-7 xs:w-8 sm:w-12 h-full min-h-[80px] max-h-[192px] rounded',
                      color.background,
                      {
                        ['outline outline-3 outline-offset-2 outline-slate-300']:
                          isSelected[index],
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
                backgroundColor,
                {
                  ['pointer-events-none']:
                    !calendarInfo.name || !calendarInfo.themeColor,
                },
              )}
              disabled={!calendarInfo.name || !calendarInfo.themeColor}
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
