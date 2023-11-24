import CalendarView from '../../components/CalendarView';
import CreateEventModal from '../../components/EventModals/Create';
import EditEventModal from '../../components/EventModals/Edit';
import Header from '../../components/Header';

function Calendar() {
  return (
    <div className='flex w-screen'>
      <CalendarView />
      <CreateEventModal />
      <EditEventModal />
      <Header />
    </div>
  );
}

export default Calendar;
