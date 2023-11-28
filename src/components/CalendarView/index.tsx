import { useState } from 'react';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import MonthlyView from './MonthlyView';
import Navigation from './Navigation';
import SideBar from './SideBar';
import WeeklyView from './WeeklyView';

function CalendarView() {
  const { currentView } = useViewStore();
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  return (
    <div className='grow flex flex-col'>
      <Navigation setIsSideBarOpen={setIsSideBarOpen} />
      <div className='flex w-full' style={{ height: 'calc(100vh - 64px)' }}>
        <SideBar isSideBarOpen={isSideBarOpen} />
        <div className='px-6 py-4 flex grow overflow-auto'>
          {currentView === CalendarViewCategory.Monthly && <MonthlyView />}
          {currentView === CalendarViewCategory.Weekly && <WeeklyView />}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
