import CalendarView from '../../components/CalendarView';
import Header from '../../components/Header';
import SideBar from '../../components/SideBar';

function Calendar() {
  return (
    <>
      <Header />
      <div className='flex'>
        <SideBar />
        <CalendarView />
      </div>
    </>
  );
}

export default Calendar;
