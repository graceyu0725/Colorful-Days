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
    name: '',
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
  const [backGroundColor, setBackGroundColor] = useState('bg-slate-200');
  const [borderColor, setBorderColor] = useState('border-slate-200');

  return (
    <>
      <div
        className={clsx(
          'flex items-center justify-center h-screen bg-cover bg-slate-200',
          backGroundColor,
        )}
      >
        <Card className='w-11/12 p-0 rounded-none flex flex-col items-center justify-center gap-10 z-10 h-5/6'>
          <div className='flex flex-col items-center gap-5'>
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
                    setBackGroundColor(themeColors[index].bg);
                    setBorderColor(themeColors[index].border);
                  }}
                />
              ))}
            </div>
          </div>
          <Button
            color='default'
            className='w-32'
            disabled={!calendarInfo.name || !calendarInfo.themeColor}
            onClick={() =>
              state.isNativeSignup
                ? firebase.signUp(state.userInfo, navigate, calendarInfo)
                : addUserForGoogle(state.userInfo, navigate, calendarInfo)
            }
          >
            送出
          </Button>
        </Card>
      </div>
    </>
  );
}
