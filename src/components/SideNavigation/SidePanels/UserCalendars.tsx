import {
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import MaterialSymbolsAddBoxOutlineRounded from '~icons/material-symbols/add-box-outline-rounded';
import PhDotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../../store/authStore';
import { useEventsStore } from '../../../store/eventsStore';
import { useModalStore } from '../../../store/modalStore';
import {
  deleteCalendar,
  updateCalendarContent,
  updateCurrentUser,
} from '../../../utils/handleUserAndCalendar';
import { CalendarContent } from '../../../utils/types';

type Props = {
  currentCalendarId: string;
  calendarDetails: CalendarContent[];
};

const UserCalendars: React.FC<Props> = ({
  currentCalendarId,
  calendarDetails,
}) => {
  const {
    currentUser,
    setCurrentCalendarId,
    setCurrentCalendarContent,
    setCurrentUser,
    currentThemeColor,
  } = useAuthStore();
  const { setIsAddCalendarModalOpen } = useModalStore();
  const { setCalendarAllEvents } = useEventsStore();

  const [hoveredCalendarId, setHoveredCalendarId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteCalendar = async (calendarDetail: CalendarContent) => {
    setIsLoading(true);
    await deleteCalendar(calendarDetail);
    // updateCalendarContent(
    //   previousCalendarId,
    //   setCurrentCalendarId,
    //   setCurrentCalendarContent,
    //   setCalendarAllEvents,
    // );
    updateCurrentUser(
      currentUser.userId,
      setCurrentUser,
      setCurrentCalendarId,
      setCurrentCalendarContent,
    );
    setIsLoading(false);

    toast.success('Calendar removed successfully');
  };

  return (
    <div className='py-4 px-3 flex flex-col gap-3 overflow-y-auto'>
      <div
        className={clsx(
          'mb-2 shadow-md flex items-center justify-center gap-2 h-10 text-lg leading-10 bg-slate-200 rounded-xl outline outline-1 outline-offset-2 text-white transition',
          currentThemeColor.darkBackground,
          currentThemeColor.outline,
        )}
      >
        <UilSchedule />
        My Calendars
      </div>

      {calendarDetails.map((calendarDetail, index) => (
        <Card
          key={index}
          className={clsx(
            'h-12 shrink-0 rounded-xl shadow border hover:cursor-pointer text-center transform transition hover:scale-105',
            {
              [`outline hover:scale-100 border-none shadow-md ${currentThemeColor.outline}`]:
                calendarDetail.calendarId === currentCalendarId,
            },
          )}
          onMouseEnter={() => setHoveredCalendarId(calendarDetail.calendarId)}
          onMouseLeave={() => setHoveredCalendarId(null)}
        >
          <div
            className='flex items-center justify-between gap-2 w-full h-full p-3'
            onClick={() => {
              if (calendarDetail.calendarId !== currentCalendarId) {
                updateCalendarContent(
                  calendarDetail.calendarId,
                  setCurrentCalendarId,
                  setCurrentCalendarContent,
                  setCalendarAllEvents,
                );
              }
            }}
          >
            <div className='truncate'>
              <ScrollShadow
                hideScrollBar
                offset={0}
                orientation='horizontal'
                className='w-36 text-start'
              >
                {calendarDetail.name}
              </ScrollShadow>
            </div>

            {(hoveredCalendarId === calendarDetail.calendarId ||
              currentCalendarId === calendarDetail.calendarId) &&
              calendarDetails.length > 1 && (
                <Popover placement='bottom'>
                  <PopoverTrigger className='border-none outline-none'>
                    <button>
                      <PhDotsThreeVerticalBold className='w-4 h-4 p-0' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0 rounded-lg'>
                    <Button
                      isLoading={isLoading}
                      color='danger'
                      variant='bordered'
                      className='p-0 border-0'
                      onClick={() => handleDeleteCalendar(calendarDetail)}
                    >
                      delete
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
          </div>
        </Card>
      ))}

      <Card className='shrink-0 h-12 rounded-xl shadow border hover:cursor-pointer flex-row items-center justify-center gap-2 transform transition hover:scale-105'>
        <div
          className='flex items-center justify-center gap-2 w-full h-full'
          onClick={() => {
            setIsAddCalendarModalOpen(true);
          }}
        >
          <MaterialSymbolsAddBoxOutlineRounded className='w-5 h-5 text-slate-400'></MaterialSymbolsAddBoxOutlineRounded>
          <div className='text-slate-400'>Add Calendar</div>
        </div>
      </Card>
    </div>
  );
};

export default UserCalendars;
