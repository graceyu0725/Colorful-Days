import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarView from '../../components/CalendarView';
import CreateEventModal from '../../components/EventModals/Create';
import EditEventModal from '../../components/EventModals/Edit';
import Header from '../../components/Header';
import { useAuthStore } from '../../store/authStore';

function Calendar() {
  const { isLogin, setIsLogin } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid);
        localStorage.setItem('uid', user.uid);
        setIsLogin(true);
      } else {
        localStorage.removeItem('uid');
        navigate('/signin');
      }
    });
  }, []);

  return (
    <div className='flex w-screen'>
      {localStorage.getItem('uid') ? (
        <>
          <CalendarView />
          <CreateEventModal />
          <EditEventModal />
          <Header />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Calendar;
