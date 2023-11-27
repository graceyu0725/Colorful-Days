import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import MonthlyView from './MonthlyView';
import Navigation from './Navigation';
import SideBar from './SideBar';
import WeeklyView from './WeeklyView';

function CalendarView() {
  const { currentView, currentDate, setCurrentDate, formateDate } =
    useViewStore();
  console.log(currentView);

  return (
    <div className='grow flex flex-col'>
      <Navigation />
      <div className='flex w-full' style={{ height: 'calc(100vh - 64px)' }}>
        <SideBar />
        <div className='px-6 py-4 flex grow'>
          {currentView === CalendarViewCategory.Monthly && <MonthlyView />}
          {currentView === CalendarViewCategory.Weekly && <WeeklyView />}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
