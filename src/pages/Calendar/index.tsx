import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CalendarView from '../../components/CalendarView';
import CreateEventModal from '../../components/EventModals/Create';
import EditEventModal from '../../components/EventModals/Edit';
import MoreEventModal from '../../components/EventModals/More';
import Header from '../../components/Header';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { db } from '../../utils/firebase';
import { updateAllEvents } from '../../utils/handleDatesAndEvents';
import { updateCurrentUser } from '../../utils/handleUserAndCalendar';

function Calendar() {
  const {
    setIsLogin,
    setCurrentUser,
    setCurrentCalendarId,
    currentCalendarId,
    setCurrentCalendarContent,
  } = useAuthStore();
  const { setCalendarAllEvents } = useEventsStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentCalendarId) {
      console.log('沒有calendarId');
      return;
    }
    console.log('現在的calendarId', currentCalendarId);
    // const calendarId = currentUser.calendars[0]

    const eventsCollection = collection(
      db,
      'Calendars',
      currentCalendarId,
      'events',
    );

    const orderedEventsCollection = query(
      eventsCollection,
      orderBy('createdAt', 'asc'),
    );

    const unsubscribe = onSnapshot(orderedEventsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          updateAllEvents(snapshot, setCalendarAllEvents);
        }
        if (change.type === 'modified') {
          updateAllEvents(snapshot, setCalendarAllEvents);
        }
        if (change.type === 'removed') {
          updateAllEvents(snapshot, setCalendarAllEvents);
        }
      });
    });

    return () => {
      console.log(`取消訂閱: ${currentCalendarId}`);
      unsubscribe();
    };
  }, [currentCalendarId]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        localStorage.setItem('uid', user.uid);
        setIsLogin(true);
        updateCurrentUser(
          user.uid,
          setCurrentUser,
          setCurrentCalendarId,
          setCurrentCalendarContent,
        );
        // TODO: 取得該使用者下有的calendarId & name
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
          <MoreEventModal />
          <Header />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Calendar;
