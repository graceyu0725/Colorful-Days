import { Card } from '@nextui-org/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import MaterialSymbolsAddBoxOutlineRounded from '~icons/material-symbols/add-box-outline-rounded';
import { CalendarContent } from '../../../utils/types';

type Props = {
  isUserCalendarsOpen: boolean;
  currentCalendarId: string;
  calendarDetails: CalendarContent[];
};

const UserCalendars: React.FC<Props> = ({
  isUserCalendarsOpen,
  currentCalendarId,
  calendarDetails,
}) => {
  const navigate = useNavigate();

  // const getCalendarName = () => {
  //   let userCalendarsNames = [];
  //   const calendarsCollection = collection(db, 'Calendars');

  //   userCalendars.map((calendarId)=>{

  //   })
  // }

  // const userCalendarsNames = getAllCalendarDetail(userCalendars);
  // console.log(userCalendarsNames);

  return (
    <div
      className={clsx('w-0 overflow-hidden transition-all flex flex-col', {
        'w-56': isUserCalendarsOpen,
      })}
    >
      <div className='h-16 border-b text-center py-5'>My Calendars</div>
      <div className='py-3 px-2 flex flex-col gap-3'>
        {calendarDetails.map((calendarDetail, index) => (
          <Card
            key={index}
            className={clsx(
              'h-12 rounded-lg shadow border hover:cursor-pointer p-3 text-center',
              {
                ['outline outline-slate-300']:
                  calendarDetail.calendarId === currentCalendarId,
              },
            )}
          >
            <div className='truncate'>{calendarDetail.name}</div>
          </Card>
        ))}
        <Card className='h-12 rounded-lg shadow border hover:cursor-pointer flex-row items-center justify-center gap-2'>
          <div
            className='flex items-center justify-center gap-2 w-full h-full'
            onClick={() => {
              console.log('點擊');
              navigate('/select', {
                state: {
                  userInfo: {
                    name: '',
                    email: '',
                    password: '',
                  },
                  isNativeSignup: false,
                  isCreateCalendar: true,
                },
              });
            }}
          >
            <MaterialSymbolsAddBoxOutlineRounded className='w-5 h-5 text-gray-500'></MaterialSymbolsAddBoxOutlineRounded>
            <div className='text-gray-500'>Add Calendar</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserCalendars;
