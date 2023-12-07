import { Button, Card } from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { firebase } from '../../utils/firebase';
import { addUserForGoogle } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';
import { CalendarInfo } from '../../utils/types';

export default function SelectTheme() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <Navigate to='/signup' replace />;

  const [calendarInfo, setCalendarInfo] = useState<CalendarInfo>({
    name: "Pikachu's calendar",
    themeColor: '',
  });

  // Update userInput when typing
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
    state.isNativeSignup
      ? await firebase.signUp(state.userInfo, navigate, calendarInfo)
      : await addUserForGoogle(state.userInfo, navigate, calendarInfo);
    setIsButtonLoading(false);
  };

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-center h-screen bg-cover bg-slate-200 transition-colors',
          backgroundColor,
        )}
      >
        <Card className='w-10/12 h-3/4 p-0 rounded-2xl flex flex-col items-center justify-center gap-10 z-10'>
          <div className='flex flex-col items-center gap-5'>
            <div className='text-2xl font-bold'>Name Your Calendar</div>
            <input
              name='name'
              className={clsx(
                'leading-[64px] border-2 w-72 h-16 rounded-lg px-5 text-lg',
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
                    setBackgroundColor(themeColors[index].background);
                    setBorderColor(themeColors[index].border);
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            isLoading={isButtonLoading}
            color='default'
            className={clsx('w-32 text-slate-700 text-base transition-colors',backgroundColor)}
            disabled={!calendarInfo.name || !calendarInfo.themeColor}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Card>
      </div>
    </>
  );
}
