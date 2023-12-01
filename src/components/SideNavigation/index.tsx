import { Avatar, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import MingcuteSettings2Line from '~icons/mingcute/settings-2-line';
import OcticonPeople16 from '~icons/octicon/people-16';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { firebase } from '../../utils/firebase';
import {
  getAllCalendarDetail,
  getAllMemberDetail,
} from '../../utils/handleUserAndCalendar';
import { themeColors } from '../../utils/theme';
import { CalendarContent, User } from '../../utils/types';
import Members from './SidePanels/Members';
import UserCalendars from './SidePanels/UserCalendars';
import AvatarImage from './avatar.png';

type Props = {
  isSideNavigationOpen: boolean;
};

const SideNavigation: React.FC<Props> = ({ isSideNavigationOpen }) => {
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

  const fetchDetails = async () => {
    const detailsOfCalendar = await getAllCalendarDetail(userCalendars);
    const detailsOfMember = await getAllMemberDetail(
      currentCalendarContent.members,
    );
    setCalendarDetails(detailsOfCalendar);
    setMemberDetails(detailsOfMember);
    console.log('更新calendar', detailsOfCalendar);
    console.log('detailsOfMember', detailsOfMember);
  };

  // 取得會員下所有日曆以及現日曆下所有成員
  useEffect(() => {
    if (currentCalendarId && userCalendars) {
      fetchDetails();
    }
  }, [userCalendars, currentCalendarContent]);

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
        <div className='flex items-center flex-col gap-4 overflow-hidden'>
          <Tooltip
            showArrow={true}
            placement='right'
            content={currentUser.email}
          >
            <button className='outline-none'>
              {currentUser.avatar ? (
                <Avatar
                  className={clsx('w-10 h-10 p-0 border-2', borderColor)}
                  src={currentUser.avatar}
                />
              ) : (
                <img
                  className={clsx(
                    'w-9 h-9 p-0 border-2 rounded-full ',
                    borderColor,
                  )}
                  src={AvatarImage}
                ></img>
                // <UserIcon className='w-9 text-2xl text-slate-700' />
              )}
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='right' content='Memo'>
            <button className='outline-none'>
              <MaterialSymbolsStickyNote2OutlineRounded className='mt-1 text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='right' content='Calendars'>
            <button
              className='outline-none'
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
              <UilSchedule className='mt-1 text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='right' content='Members'>
            <button className='outline-none'>
              <OcticonPeople16
                className='text-2xl text-slate-700 hover:cursor-pointer'
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

          <Tooltip showArrow={true} placement='right' content='Settings'>
            <button className='outline-none'>
              <MingcuteSettings2Line className='text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>

          <Tooltip showArrow={true} placement='right' content='Logout'>
            <button className='outline-none' onClick={handleLogout}>
              <MaterialSymbolsExitToAppRounded className='text-2xl text-slate-700 hover:cursor-pointer' />
            </button>
          </Tooltip>
        </div>
      </div>

      <div
        className={clsx('w-0 overflow-hidden transition-all flex flex-col', {
          'w-56 border-r': currentPanel,
        })}
      >
        {currentPanel === PanelType.Calendars && (
          <UserCalendars
            currentCalendarId={currentCalendarId}
            calendarDetails={calendarDetails}
          />
        )}
        {currentPanel === PanelType.Members && (
          <Members
            memberDetails={memberDetails}
            setMemberDetails={setMemberDetails}
          />
        )}
      </div>
    </div>
  );
};

export default SideNavigation;
