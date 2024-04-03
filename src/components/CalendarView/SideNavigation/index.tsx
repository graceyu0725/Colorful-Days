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
import MaterialSymbolsAccountCircleOutline from '~icons/material-symbols/account-circle-outline';
import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import OcticonPeople16 from '~icons/octicon/people-16';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../../store/authStore';
import { useEventsStore } from '../../../store/eventsStore';
import { firebase } from '../../../utils/firebase';
import {
  getAllCalendarDetail,
  getAllMemberDetail,
} from '../../../utils/handleUserAndCalendar';
import { CalendarContent, Event, User } from '../../../utils/types';
import { Members, Memo, Profile, UserCalendars } from './SidePanels';
import AvatarImage from './img/avatar.png';

type Props = {
  isSideNavigationOpen: boolean;
};

enum PanelType {
  None = '',
  Memos = 'Memos',
  Calendars = 'Calendars',
  Members = 'Members',
}

const SideNavigation: React.FC<Props> = ({ isSideNavigationOpen }) => {
  const {
    currentUser,
    currentCalendarContent,
    currentCalendarId,
    resetUser,
    currentThemeColor,
  } = useAuthStore();
  const { calendarAllEvents, resetAllEvents } = useEventsStore();
  const [currentPanel, setCurrentPanel] = useState<PanelType>(PanelType.None);
  const [calendarDetails, setCalendarDetails] = useState<CalendarContent[]>([]);
  const [memberDetails, setMemberDetails] = useState<User[]>([]);
  const [memoEvents, setMemoEvents] = useState<Event[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    firebase.logOut();
    resetUser();
    resetAllEvents();
  };

  const fetchDetails = async () => {
    if (!currentUser.calendars || !currentCalendarId || !calendarAllEvents)
      return;

    const filteredMemoEvents = calendarAllEvents.filter(
      (event) => event.isMemo,
    );
    setMemoEvents(filteredMemoEvents);

    const detailsOfCalendar: CalendarContent[] = await getAllCalendarDetail(
      currentUser.calendars,
    );
    setCalendarDetails(detailsOfCalendar);

    const detailsOfMember = await getAllMemberDetail(
      currentCalendarContent.members,
    );
    setMemberDetails(detailsOfMember);
  };

  useEffect(() => {
    fetchDetails();
  }, [
    currentUser.calendars,
    currentCalendarContent,
    currentCalendarId,
    calendarAllEvents,
  ]);

  const updateCurrentPanel = (type: PanelType) => {
    setCurrentPanel((prev) => (prev && prev === type ? PanelType.None : type));
  };
  const panelIcons = {
    [PanelType.Memos]: {
      type: PanelType.Memos,
      icon: MaterialSymbolsStickyNote2OutlineRounded,
      component: (
        <Memo
          currentCalendarContent={currentCalendarContent}
          memoEvents={memoEvents}
        />
      ),
    },
    [PanelType.Calendars]: {
      type: PanelType.Calendars,
      icon: UilSchedule,
      component: (
        <UserCalendars
          currentCalendarId={currentCalendarId}
          calendarDetails={calendarDetails}
        />
      ),
    },
    [PanelType.Members]: {
      type: PanelType.Members,
      icon: OcticonPeople16,
      component: (
        <Members
          memberDetails={memberDetails}
          setMemberDetails={setMemberDetails}
        />
      ),
    },
  };

  const renderProfileIcon = () => {
    return (
      <>
        <Profile
          isProfileModalOpen={isProfileModalOpen}
          setIsProfileModalOpen={setIsProfileModalOpen}
          currentUser={currentUser}
          currentThemeColor={currentThemeColor}
        />

        <Popover placement='bottom-start'>
          <PopoverTrigger>
            <button className='outline-none mt-1 w-full flex justify-center mr-px'>
              {currentUser.avatar ? (
                <Avatar
                  className={clsx(
                    'w-9 h-9 p-0 border-2 object-cover object-center',
                    currentThemeColor.border,
                  )}
                  src={currentUser.avatar}
                />
              ) : (
                <img
                  className={clsx(
                    'w-9 h-9 p-0 border-2 rounded-full object-cover object-center',
                    currentThemeColor.border,
                  )}
                  src={AvatarImage}
                />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className='p-1 flex flex-col'>
            <Button
              startContent={<MaterialSymbolsAccountCircleOutline />}
              className='bg-white hover:bg-slate-100'
              onClick={() => setIsProfileModalOpen(true)}
            >
              Profile
            </Button>
            <Button
              startContent={<MaterialSymbolsExitToAppRounded />}
              className='bg-white hover:bg-slate-100'
              onClick={handleLogout}
            >
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </>
    );
  };

  const renderPanelIcons = () => {
    return Object.values(panelIcons).map((panelIcon, index) => (
      <Tooltip
        key={index}
        showArrow={true}
        placement='right'
        content={panelIcon.type}
      >
        <button
          className={clsx(
            'outline-none w-full',
            currentPanel === panelIcon.type &&
              `border-r-4 pl-1 ${currentThemeColor.lightBorder}`,
          )}
        >
          <panelIcon.icon
            className='text-2xl text-slate-700 hover:cursor-pointer m-auto'
            onClick={() => updateCurrentPanel(panelIcon.type)}
          />
        </button>
      </Tooltip>
    ));
  };

  return (
    <div
      className={clsx(
        'hidden md:flex transition-all duration-300 ease-in-out',
        {
          'w-72': isSideNavigationOpen && currentPanel,
          'opacity-100 w-16': isSideNavigationOpen && !currentPanel,
          'opacity-0 w-0': !isSideNavigationOpen,
        },
      )}
    >
      <div
        className={clsx(
          'pl-1 pt-3 h-full border-r',
          isSideNavigationOpen ? 'w-16 flex flex-col' : 'w-0 hidden',
        )}
      >
        <div className='flex items-center flex-col gap-4 overflow-hidden h-full'>
          {renderProfileIcon()}
          {renderPanelIcons()}
        </div>
      </div>

      <div
        className={clsx('w-0 overflow-hidden transition-all flex flex-col', {
          'w-56 border-r': currentPanel,
        })}
      >
        {currentPanel && panelIcons[currentPanel].component}
      </div>
    </div>
  );
};

export default SideNavigation;
