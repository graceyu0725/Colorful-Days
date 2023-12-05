import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCalendarModal from '../../components/CalendarModals/AddCalendar';
import CalendarView from '../../components/CalendarView';
import CreateEventModal from '../../components/EventModals/Create';
import EditEventModal from '../../components/EventModals/Edit';
import MoreEventModal from '../../components/EventModals/More';
import { useAuthStore } from '../../store/authStore';
import { useEventsStore } from '../../store/eventsStore';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { updateAllEvents } from '../../utils/handleDatesAndEvents';
import { updateCurrentUser } from '../../utils/handleUserAndCalendar';

function Calendar() {
  const {
    setIsLogin,
    currentUser,
    setCurrentUser,
    currentCalendarId,
    setCurrentCalendarId,
    setCurrentCalendarContent,
  } = useAuthStore();
  const { setCalendarAllEvents } = useEventsStore();
  const { selectedEvent, setSelectedEvent } = useModalStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentCalendarId) {
      return;
    }

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

    const unsubscribeEvents = onSnapshot(
      orderedEventsCollection,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            updateAllEvents(snapshot, setCalendarAllEvents);
          }
          if (change.type === 'modified') {
            updateAllEvents(
              snapshot,
              setCalendarAllEvents,
              selectedEvent,
              setSelectedEvent,
            );
          }
          if (change.type === 'removed') {
            updateAllEvents(snapshot, setCalendarAllEvents);
          }
        });
      },
    );

    const calendarDocRef = doc(db, 'Calendars', currentCalendarId);
    const unsubscribeCalendar = onSnapshot(calendarDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setCurrentCalendarContent({
          members: docSnapshot.data().members,
          name: docSnapshot.data().name,
          tags: docSnapshot.data().tags,
          themeColor: docSnapshot.data().themeColor,
          calendarId: docSnapshot.data().calendarId,
        });
      } else {
        console.log('Calendar not found');
      }
    });

    return () => {
      console.log(`取消訂閱: ${currentCalendarId}`);
      unsubscribeEvents();
      unsubscribeCalendar();
    };
  }, [currentCalendarId, selectedEvent]);

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      console.log('沒有 currentUser 或 currentUser.email');
      return;
    }

    const usersCollectionRef = collection(db, 'Users');
    const docRef = doc(usersCollectionRef, currentUser.email);
    const unsubscribeByEmail = onSnapshot(docRef, (docSnapshot) => {
      console.log('Matching users:', docSnapshot.data());
      console.log('currentUser:', currentUser);
      if (docSnapshot.exists()) {
        const updatedUser = {
          ...currentUser,
          calendars: docSnapshot.data().calendars,
        };
        setCurrentUser(updatedUser);
      }
      // updateCurrentUser(
      //   docSnapshot.data()?.userId,
      //   setCurrentUser,
      //   setCurrentCalendarId,
      //   setCurrentCalendarContent,
      // );
    });

    return () => {
      console.log('取消訂閱 user');
      unsubscribeByEmail();
    };
  }, [currentUser.email]);

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
          <AddCalendarModal />
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default Calendar;
