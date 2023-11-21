import { format } from 'date-fns';
import { useState } from 'react';
import MonthlyView from './MonthlyView';
import Navigation from './Navigation';

function CalendarView() {
  const [date, setDate] = useState(new Date());
  const [formateDate, setFormateDate] = useState(format(date, 'MMMM, yyyy'));

  return (
    <div className='ml-64 flex w-full flex-col px-6 py-2'>
      <Navigation
        date={date}
        setDate={setDate}
        formateDate={formateDate}
        setFormateDate={setFormateDate}
      />
      <MonthlyView
        date={date}
        setDate={setDate}
        formateDate={formateDate}
        setFormateDate={setFormateDate}
      />
    </div>
  );
}

export default CalendarView;
