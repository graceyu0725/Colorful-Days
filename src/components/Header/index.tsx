import { Avatar, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import MingcuteSettings2Line from '~icons/mingcute/settings-2-line';
import OcticonPeople16 from '~icons/octicon/people-16';
import User from '~icons/streamline/interface-user-circle-circle-geometric-human-person-single-user';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { firebase } from '../../utils/firebase';
import { themeColors } from '../../utils/theme';
import { initialCalendarContent, initialUser } from '../../utils/types';

function Header() {
  const {
    currentUser,
    currentCalendarContent,
    setIsLogin,
    setCurrentUser,
    setCurrentCalendarId,
    setCurrentCalendarContent,
  } = useAuthStore();
  const { setAllEvents, setCalendarAllEvents } = useEventsStore();

  const themeColorIndex: number =
    Number(currentCalendarContent.themeColor) || 0;
  const backgroundColor = themeColors[themeColorIndex]?.light || 'bg-slate-100';

  const handleLogout = () => {
    firebase.logOut();
    setCurrentUser(initialUser);
    setCurrentCalendarId('');
    setCurrentCalendarContent(initialCalendarContent);
    setAllEvents([]);
    setCalendarAllEvents([]);
    setIsLogin(false);
  };

  return (
    <div
      className={clsx('right-0 w-14 h-screen flex flex-col', backgroundColor)}
    >
      <div className='flex items-center flex-col gap-4 overflow-hidden'>
        <div className='h-16 w-full border-b flex justify-center'>
          <Tooltip
            showArrow={true}
            placement='left'
            content={currentUser.email}
          >
            <button>
              {currentUser.avatar ? (
                <Avatar className='w-9 h-9 p-0' src={currentUser.avatar} />
              ) : (
                <User className='text-2xl text-slate-700' />
              )}
            </button>
          </Tooltip>
        </div>

        <Tooltip showArrow={true} placement='left' content='Calendars'>
          <button>
            <UilSchedule className='mt-1 text-2xl text-slate-700 hover:cursor-pointer' />
          </button>
        </Tooltip>

        <Tooltip showArrow={true} placement='left' content='Memo'>
          <button>
            <MaterialSymbolsStickyNote2OutlineRounded className='mt-1 text-2xl text-slate-700 hover:cursor-pointer' />
          </button>
        </Tooltip>

        <Tooltip showArrow={true} placement='left' content='Members'>
          <button>
            <OcticonPeople16 className='text-2xl text-slate-700 hover:cursor-pointer' />
          </button>
        </Tooltip>

        <Tooltip showArrow={true} placement='left' content='Settings'>
          <button>
            <MingcuteSettings2Line className='text-2xl text-slate-700 hover:cursor-pointer' />
          </button>
        </Tooltip>

        <Tooltip showArrow={true} placement='left' content='Logout'>
          <button onClick={handleLogout}>
            <MaterialSymbolsExitToAppRounded className='text-2xl text-slate-700 hover:cursor-pointer' />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Header;
