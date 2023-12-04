import {
  Button,
  Card,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from '@nextui-org/react';
import clsx from 'clsx';
import MaterialSymbolsAddBoxOutlineRounded from '~icons/material-symbols/add-box-outline-rounded';
import PhDotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
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
  } = useAuthStore();
  const { setIsAddCalendarModalOpen } = useModalStore();
  const { setCalendarAllEvents } = useEventsStore();

  const handleDeleteCalendar = async (
    calendarDetail: CalendarContent,
    previousCalendarId: string,
  ) => {
    await deleteCalendar(calendarDetail);
    console.log('previousCalendarId', typeof previousCalendarId);
    updateCalendarContent(
      previousCalendarId,
      setCurrentCalendarId,
      setCurrentCalendarContent,
      setCalendarAllEvents,
    );
    updateCurrentUser(
      currentUser.userId,
      setCurrentUser,
      setCurrentCalendarId,
      setCurrentCalendarContent,
    );
  };

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

            {calendarDetail.calendarId === currentCalendarId &&
              calendarDetails.length > 1 && (
                <Popover placement='bottom'>
                  <PopoverTrigger>
                    <button>
                      <PhDotsThreeVerticalBold className='w-4 h-4 p-0' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0 rounded-lg'>
                    <Button
                      color='danger'
                      variant='bordered'
                      className='p-0 border-0'
                      onClick={() => {
                        const newIndex =
                          index === 0 ? calendarDetails.length - 1 : index - 1;
                        handleDeleteCalendar(
                          calendarDetail,
                          calendarDetails[newIndex].calendarId,
                        );
                      }}
                    >
                      delete
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
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
