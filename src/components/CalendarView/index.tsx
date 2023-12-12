import { useState } from 'react';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import { ContextProvider } from '../DND';
import SideNavigation from '../SideNavigation';
import MonthlyView from './MonthlyView';
import Navigation from './Navigation';
import SideBar from './SideBar';
import WeeklyView from './WeeklyView';

function CalendarView() {
  const { currentView } = useViewStore();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSideNavigationOpen, setIsSideNavigationOpen] = useState(true);

  return (
    <div className='grow flex flex-col'>
      <Navigation
        setIsSideBarOpen={setIsSideBarOpen}
        setIsSideNavigationOpen={setIsSideNavigationOpen}
      />
      <div className='flex w-full' style={{ height: 'calc(100vh - 64px)' }}>
        <SideNavigation isSideNavigationOpen={isSideNavigationOpen} />
        <div className='px-6 py-4 flex grow overflow-auto'>
          <ContextProvider>
            {currentView === CalendarViewCategory.Monthly && <MonthlyView />}
            {currentView === CalendarViewCategory.Weekly && <WeeklyView />}
          </ContextProvider>
        </div>
        <SideBar isSideBarOpen={isSideBarOpen} />
      </div>
    </div>
  );
}

export default CalendarView;
