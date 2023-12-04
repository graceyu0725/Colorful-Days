import { Card } from '@nextui-org/react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import MaterialSymbolsAddBoxOutlineRounded from '~icons/material-symbols/add-box-outline-rounded';
import { useAuthStore } from '../../../store/authStore';
import { useModalStore } from '../../../store/modalStore';
import { updateCalendarContent } from '../../../utils/handleUserAndCalendar';
import { CalendarContent } from '../../../utils/types';

type Props = {
  currentCalendarId: string;
  calendarDetails: CalendarContent[];
};

const UserCalendars: React.FC<Props> = ({
  currentCalendarId,
  calendarDetails,
}) => {
  const navigate = useNavigate();
  const { setCurrentCalendarId, setCurrentCalendarContent } = useAuthStore();
  const { isAddCalendarModalOpen, setIsAddCalendarModalOpen } = useModalStore();

  return (
    <div className='py-3 px-4 flex flex-col gap-3 overflow-y-auto'>
      <div className='text-center'>My Calendars</div>
      {calendarDetails.map((calendarDetail, index) => (
        <Card
          key={index}
          className={clsx(
            'h-12 rounded-lg shadow border hover:cursor-pointer text-center',
            {
              ['outline outline-slate-300']:
                calendarDetail.calendarId === currentCalendarId,
            },
          )}
        >
          <div
            className='flex items-center justify-center gap-2 w-full h-full p-3'
            onClick={() => {
              updateCalendarContent(
                calendarDetail.calendarId,
                setCurrentCalendarId,
                setCurrentCalendarContent,
              );
            }}
          >
            <div className='truncate'>{calendarDetail.name}</div>
          </div>
        </Card>
      ))}
      <Card className='h-12 rounded-lg shadow border hover:cursor-pointer flex-row items-center justify-center gap-2'>
        <div
          className='flex items-center justify-center gap-2 w-full h-full'
          onClick={() => {
            setIsAddCalendarModalOpen(true);
          }}
        >
          <MaterialSymbolsAddBoxOutlineRounded className='w-5 h-5 text-gray-500'></MaterialSymbolsAddBoxOutlineRounded>
          <div className='text-gray-500'>Add Calendar</div>
        </div>
      </Card>
    </div>
  );
};

export default UserCalendars;
