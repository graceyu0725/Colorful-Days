import MonthlyView from './MonthlyView';
import Navigation from './Navigation';

function CalendarView() {
  return (
    <div className='ml-72 flex w-full flex-col px-6 py-4'>
      <Navigation />
      <MonthlyView />
    </div>
  );
}

export default CalendarView;
