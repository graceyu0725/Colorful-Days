import { format } from 'date-fns';
import { useState } from 'react';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import MonthlyView from './MonthlyView';
import Navigation from './Navigation';
import SideBar from './SideBar';
import WeeklyView from './WeeklyView';

function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [formateDate, setFormateDate] = useState(format(date, 'MMMM, yyyy'));

  const { currentView } = useViewStore();
  console.log(currentView);

  return (
    <div className='grow flex flex-col'>
      <Navigation
        date={date}
        setDate={setDate}
        formateDate={formateDate}
        setFormateDate={setFormateDate}
      />
      <div className='flex w-full' style={{ height: 'calc(100vh - 64px)' }}>
        <SideBar />
        <div className='px-6 py-4 flex w-full'>
          {currentView === CalendarViewCategory.Monthly && (
            <MonthlyView
              date={date}
              setDate={setDate}
              formateDate={formateDate}
              setFormateDate={setFormateDate}
            />
          )}
          {currentView === CalendarViewCategory.Weekly && (
            <WeeklyView
              date={date}
              setDate={setDate}
              formateDate={formateDate}
              setFormateDate={setFormateDate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;
