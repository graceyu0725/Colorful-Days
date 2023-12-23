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
import { useAuthStore } from '../../../../store/authStore';
import { useEventsStore } from '../../../../store/eventsStore';
import { useModalStore } from '../../../../store/modalStore';
import {
  deleteCalendar,
  updateCalendarContent,
  updateCurrentUser,
} from '../../../../utils/handleUserAndCalendar';
import {
  CalendarContent,
  initialCalendarContent,
} from '../../../../utils/types';
import EditCalendar from '../../../CalendarModals/EditCalendar';

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

  const [hoveredCalendar, setHoveredCalendar] = useState<CalendarContent>(
    initialCalendarContent,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditCalendarModalOpen, setIsEditCalendarModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleEditCalendar = () => {
    if (currentUser.userId === hoveredCalendar.members[0]) {
      setIsEditCalendarModalOpen(true);
      setIsPopoverOpen(false);
      return;
    }
    toast.error('You are not allowed to edit this calendar!');
  };

  const handleDeleteCalendar = async (calendarDetail: CalendarContent) => {
    setIsLoading(true);

    if (currentUser.userId === calendarDetail.members[0]) {
      await deleteCalendar(calendarDetail);
      updateCurrentUser(
        currentUser.userId,
        setCurrentUser,
        setCurrentCalendarId,
        setCurrentCalendarContent,
      );
      toast.success('Calendar removed successfully');
      setIsLoading(false);
      return;
    }

    toast.error('You are not allowed to delete this calendar!');
    setIsLoading(false);
    setIsPopoverOpen(false);
  };

  const renderCalendarList = () => {
    return calendarDetails.map((calendarDetail, index) => {
      const shouldShowMenu =
        hoveredCalendar &&
        hoveredCalendar.calendarId === calendarDetail.calendarId &&
        calendarDetails.length > 1;

      return (
        <Card
          key={index}
          className={clsx(
            'h-12 shrink-0 rounded-xl shadow border hover:cursor-pointer text-center transform transition hover:scale-105',
            {
              [`outline hover:scale-100 border-none shadow-md ${currentThemeColor.outline}`]:
                calendarDetail.calendarId === currentCalendarId,
            },
          )}
          onMouseEnter={() => {
            setHoveredCalendar(calendarDetail);
          }}
          onMouseLeave={() => {
            setIsPopoverOpen(false);
          }}
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

            {shouldShowMenu && (
              <Popover
                placement='bottom'
                isOpen={isPopoverOpen}
                onOpenChange={() => setIsPopoverOpen((isOpen) => !isOpen)}
              >
                <PopoverTrigger className='border-none outline-none'>
                  <button>
                    <PhDotsThreeVerticalBold className='w-4 h-4 p-0' />
                  </button>
                </PopoverTrigger>
                <PopoverContent className='px-0 py-2 rounded-lg flex flex-col'>
                  <Button
                    color='default'
                    variant='bordered'
                    className='p-0 border-0 h-7 hover:bg-slate-100 rounded'
                    onClick={handleEditCalendar}
                  >
                    Edit
                  </Button>
                  <Button
                    isLoading={isLoading}
                    color='danger'
                    variant='bordered'
                    className='p-0 border-0 h-7 hover:bg-slate-100 rounded'
                    onClick={() => handleDeleteCalendar(calendarDetail)}
                  >
                    delete
                  </Button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </Card>
      );
    });
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

      {renderCalendarList()}

      <Card className='shrink-0 h-12 rounded-xl shadow border hover:cursor-pointer flex-row items-center justify-center gap-2 transform transition hover:scale-105'>
        <div
          className='flex items-center justify-center gap-2 w-full h-full'
          onClick={() => {
            setIsAddCalendarModalOpen(true);
          }}
        >
          <MaterialSymbolsAddBoxOutlineRounded className='w-5 h-5 text-slate-400' />
          <div className='text-slate-400'>Add Calendar</div>
        </div>
      </Card>

      <EditCalendar
        isEditCalendarModalOpen={isEditCalendarModalOpen}
        setIsEditCalendarModalOpen={setIsEditCalendarModalOpen}
        hoveredCalendar={hoveredCalendar}
        setHoveredCalendar={setHoveredCalendar}
      />
    </div>
  );
};

export { UserCalendars };
