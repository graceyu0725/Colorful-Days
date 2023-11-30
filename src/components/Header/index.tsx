import { Avatar, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import MingcuteSettings2Line from '~icons/mingcute/settings-2-line';
import OcticonPeople16 from '~icons/octicon/people-16';
import User from '~icons/streamline/interface-user-circle-circle-geometric-human-person-single-user';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { firebase } from '../../utils/firebase';
import { getAllCalendarDetail } from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';
import { CalendarContent } from '../../utils/types';
import UserCalendars from './SidePanels/UserCalendars';

function Header() {
  const { currentUser, currentCalendarContent, currentCalendarId, resetUser } =
    useAuthStore();
  const { resetAllEvents } = useEventsStore();

  // Handle functions of icons
  const themeColorIndex: number =
    Number(currentCalendarContent.themeColor) || 0;
  const backgroundColor = themeColors[themeColorIndex]?.light || 'bg-slate-100';
  const borderColor =
    themeColors[themeColorIndex]?.border || 'border-slate-100';
  const userCalendars = currentUser.calendars || [''];

  const handleLogout = () => {
    firebase.logOut();
    resetUser();
    resetAllEvents();
  };

  // Handle data of props
  const [isUserCalendarsOpen, setIsUserCalendarsOpen] = useState(false);
  const [calendarDetails, setCalendarDetails] = useState<CalendarContent[]>([]);

  useEffect(() => {
    const fetchCalendarDetails = async () => {
      const details = await getAllCalendarDetail(userCalendars);
      setCalendarDetails(details);
    };

    fetchCalendarDetails();
  }, [userCalendars]);

  console.log(calendarDetails);

  return (
    <div className='flex'>
      <div className={clsx('w-14 h-screen flex flex-col', backgroundColor)}>
        <div className='flex items-center flex-col gap-4 overflow-hidden'>
          <div className='h-16 w-full border-b flex justify-center'>
            <Tooltip
              showArrow={true}
              placement='left'
              content={currentUser.email}
            >
              <button className='outline-none'>
                {currentUser.avatar ? (
                  <Avatar
                    className={clsx(
                      'w-10 h-10 p-0 border-2 border-white',
                      borderColor,
                    )}
                    src={currentUser.avatar}
                  />
                ) : (
                  <User className='w-9 text-2xl text-slate-700' />
                )}
              </button>
            </Tooltip>
          </div>

          <Tooltip showArrow={true} placement='left' content='Calendars'>
            <button
              className='outline-none'
              onClick={() => setIsUserCalendarsOpen((prev) => !prev)}
            >
              <UilSchedule className='mt-1 text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='left' content='Memo'>
            <button className='outline-none'>
              <MaterialSymbolsStickyNote2OutlineRounded className='mt-1 text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='left' content='Members'>
            <button className='outline-none'>
              <OcticonPeople16 className='text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='left' content='Settings'>
            <button className='outline-none'>
              <MingcuteSettings2Line className='text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='left' content='Logout'>
            <button className='outline-none' onClick={handleLogout}>
              <MaterialSymbolsExitToAppRounded className='text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>
        </div>
      </div>

      <UserCalendars
        isUserCalendarsOpen={isUserCalendarsOpen}
        currentCalendarId={currentCalendarId}
        calendarDetails={calendarDetails}
      />
    </div>
  );
}

export default Header;
