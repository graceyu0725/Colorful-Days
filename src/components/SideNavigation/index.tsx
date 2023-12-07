import {
  Avatar,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import OcticonPeople16 from '~icons/octicon/people-16';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { firebase } from '../../utils/firebase';
import {
  getAllCalendarDetail,
  getAllMemberDetail,
} from '../../utils/handleUserAndCalendar';
import { CalendarContent, Event, User } from '../../utils/types';
import Members from './SidePanels/Members';
import Memo from './SidePanels/Memo';
import UserCalendars from './SidePanels/UserCalendars';
import AvatarImage from './avatar.png';

type Props = {
  isSideNavigationOpen: boolean;
};

const SideNavigation: React.FC<Props> = ({ isSideNavigationOpen }) => {
  const {
    currentUser,
    currentCalendarContent,
    currentCalendarId,
    resetUser,
    currentThemeColor,
  } = useAuthStore();
  const { calendarAllEvents, resetAllEvents } = useEventsStore();

  const userCalendars = currentUser.calendars || [''];

  const handleLogout = () => {
    firebase.logOut();
    resetUser();
    resetAllEvents();
  };

  enum PanelType {
    None = '',
    Profile = 'Profile',
    Memo = 'Memo',
    Calendars = 'Calendars',
    Members = 'Members',
  }

  // Handle data of props
  const [currentPanel, setCurrentPanel] = useState<PanelType>(PanelType.None);
  const [calendarDetails, setCalendarDetails] = useState<CalendarContent[]>([]);
  const [memberDetails, setMemberDetails] = useState<User[]>([]);
  const [memoEvents, setMemoEvents] = useState<Event[]>([]);

  const fetchDetails = async () => {
    const filteredMemoEvents = calendarAllEvents.filter(
      (event) => event.isMemo,
    );
    setMemoEvents(filteredMemoEvents);

    const detailsOfCalendar = await getAllCalendarDetail(userCalendars);
    setCalendarDetails(detailsOfCalendar);

    const detailsOfMember = await getAllMemberDetail(
      currentCalendarContent.members,
    );
    setMemberDetails(detailsOfMember);
  };

  // 取得會員下所有日曆以及現日曆下所有成員
  useEffect(() => {
    if (currentCalendarId && userCalendars && calendarAllEvents) {
      fetchDetails();
    }
  }, [
    userCalendars,
    currentCalendarContent,
    currentCalendarId,
    calendarAllEvents,
  ]);

  const PANEL_COMPONENTS = {
    [PanelType.Profile]: <></>,
    [PanelType.Memo]: (
      <Memo
        currentCalendarContent={currentCalendarContent}
        memoEvents={memoEvents}
      />
    ),
    [PanelType.Calendars]: (
      <UserCalendars
        currentCalendarId={currentCalendarId}
        calendarDetails={calendarDetails}
      />
    ),
    [PanelType.Members]: (
      <Members
        memberDetails={memberDetails}
        setMemberDetails={setMemberDetails}
      />
    ),
  };

  return (
    <div
      className={clsx('flex', {
        'w-0': !isSideNavigationOpen,
      })}
    >
      <div
        className={clsx(
          'w-16 pl-1 pt-3 h-full flex flex-col border-r transition-all',
          { 'w-0 hidden': !isSideNavigationOpen },
          // {
          //   ['hidden']: !isSideNavigationOpen,
          // },
          // , backgroundColor
        )}
      >
        <div className='flex items-center flex-col gap-4 overflow-hidden h-full'>
          <Popover placement='bottom-start'>
            <PopoverTrigger>
              <button className='outline-none mt-1'>
                {currentUser.avatar ? (
                  <Avatar
                    className={clsx(
                      'w-10 h-10 p-0 border-2',
                      currentThemeColor.border,
                    )}
                    src={currentUser.avatar}
                  />
                ) : (
                  <img
                    className={clsx(
                      'w-9 h-9 p-0 border-2 rounded-full',
                      currentThemeColor.border,
                    )}
                    src={AvatarImage}
                  />
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className='p-0'>
              <Button
                startContent={<MaterialSymbolsExitToAppRounded />}
                className='bg-white'
                onClick={handleLogout}
              >
                Logout
              </Button>
            </PopoverContent>
          </Popover>

          <Tooltip showArrow={true} placement='right' content='Memo'>
            <button
              className={clsx('outline-none w-full', {
                'border-r-4 pl-1': currentPanel === PanelType.Memo,
              })}
            >
              <MaterialSymbolsStickyNote2OutlineRounded
                className='text-2xl text-slate-700 hover:cursor-pointer m-auto'
                onClick={() =>
                  setCurrentPanel((prev) =>
                    prev
                      ? prev === PanelType.Memo
                        ? PanelType.None
                        : PanelType.Memo
                      : PanelType.Memo,
                  )
                }
              />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='right' content='Calendars'>
            <button
              className={clsx('outline-none w-full', {
                'border-r-4 pl-1': currentPanel === PanelType.Calendars,
              })}
              onClick={() =>
                setCurrentPanel((prev) =>
                  prev
                    ? prev === PanelType.Calendars
                      ? PanelType.None
                      : PanelType.Calendars
                    : PanelType.Calendars,
                )
              }
            >
              <UilSchedule className='text-2xl text-slate-700 hover:cursor-pointer m-auto' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='right' content='Members'>
            <button
              className={clsx('outline-none w-full', {
                'border-r-4 pl-1': currentPanel === PanelType.Members,
              })}
            >
              <OcticonPeople16
                className='text-2xl text-slate-700 hover:cursor-pointer m-auto'
                onClick={() =>
                  setCurrentPanel((prev) =>
                    prev
                      ? prev === PanelType.Members
                        ? PanelType.None
                        : PanelType.Members
                      : PanelType.Members,
                  )
                }
              />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        className={clsx('w-0 overflow-hidden transition-all flex flex-col', {
          'w-56 border-r': currentPanel,
        })}
      >
        {currentPanel && PANEL_COMPONENTS[currentPanel]}
      </div>
    </div>
  );
};

export default SideNavigation;
