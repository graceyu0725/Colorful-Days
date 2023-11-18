import CalendarView from '../../components/CalendarView';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';
import CreateEventModal from '../../components/EventModals/Create';

function Calendar() {
  return (
    <>
      <Header />
      <div className='flex'>
        <SideBar />
        <CalendarView />
        <CreateEventModal/>
      </div>
    </>
  );
}

export default Calendar;
