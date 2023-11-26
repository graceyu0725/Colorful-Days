import { Tooltip } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import MaterialSymbolsExitToAppRounded from '~icons/material-symbols/exit-to-app-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import MingcuteSettings2Line from '~icons/mingcute/settings-2-line';
import OcticonPeople16 from '~icons/octicon/people-16';
import User from '~icons/streamline/interface-user-circle-circle-geometric-human-person-single-user';
import { firebase } from '../../utils/firebase';

function Header() {
  const navigate = useNavigate();

  return (
    <div className='right-0 w-14 h-screen flex flex-col bg-slate-100'>
      {/* <nav className='border-b-3 sticky top-0 flex justify-between h-14 w-full items-center border border-slate-300 px-5 bg-slate-50 z-10'> */}
      <div className='flex items-center flex-col gap-4 overflow-hidden pt-4'>
        <div className='h-12 w-full border-b px-3'>
          <User className='text-2xl text-slate-700 hover:cursor-pointer' />
        </div>

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
          <button onClick={firebase.logOut}>
            <MaterialSymbolsExitToAppRounded className='text-2xl text-slate-700 hover:cursor-pointer' />
          </button>
        </Tooltip>
      </div>

      {/* </nav> */}
    </div>
  );
}

export default Header;
