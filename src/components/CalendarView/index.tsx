import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import { ContextProvider } from '../DND';
import Loading from './Loading';
import MonthlyView from './MonthlyView';
import SideBar from './SideBar';
import SideNavigation from './SideNavigation';
import TopNavigation from './TopNavigation';
import WeeklyView from './WeeklyView';

function CalendarView() {
  const { currentCalendarId } = useAuthStore();
  const { currentView } = useViewStore();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSideNavigationOpen, setIsSideNavigationOpen] = useState(true);

  return (
    <ContextProvider>
      <div className='grow flex flex-col'>
        <TopNavigation
          setIsSideBarOpen={setIsSideBarOpen}
          setIsSideNavigationOpen={setIsSideNavigationOpen}
        />
        <div className='flex w-full' style={{ height: 'calc(100vh - 64px)' }}>
          <SideNavigation isSideNavigationOpen={isSideNavigationOpen} />
          <div className='px-6 py-4 flex grow overflow-auto'>
            {currentCalendarId ? (
              <>
                {currentView === CalendarViewCategory.Monthly && (
                  <MonthlyView />
                )}
                {currentView === CalendarViewCategory.Weekly && <WeeklyView />}
              </>
            ) : (
              <div className='w-full h-full flex items-center justify-center'>
                <Loading />
              </div>
            )}
          </div>
          <SideBar isSideBarOpen={isSideBarOpen} />
        </div>
      </div>
    </ContextProvider>
  );
}

export default CalendarView;
