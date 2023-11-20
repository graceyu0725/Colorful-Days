import CalendarView from '../../components/CalendarView';
import CreateEventModal from '../../components/EventModals/Create';
import EditEventModal from '../../components/EventModals/Edit';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';

function Calendar() {
  return (
    <>
      <Header />
      <div className='flex'>
        <SideBar />
        <CalendarView />
        <CreateEventModal />
        <EditEventModal />
      </div>
    </>
  );
}

export default Calendar;
