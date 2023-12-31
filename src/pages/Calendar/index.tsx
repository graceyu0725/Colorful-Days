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
import { themeColors } from '../../utils/theme';

function Calendar() {
  const {
    setIsLogin,
    currentUser,
    setCurrentUser,
    currentCalendarId,
    setCurrentCalendarId,
    setCurrentCalendarContent,
    setCurrentThemeColor,
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
        setCurrentThemeColor(
          themeColors[Number(docSnapshot.data().themeColor)],
        );

        document.title = `${docSnapshot.data().name} - Colorful Days`;
      } else {
        console.error('Calendar not found');
      }
    });

    return () => {
      unsubscribeEvents();
      unsubscribeCalendar();
    };
  }, [currentCalendarId]);

  useEffect(() => {
    if (!currentUser || !currentUser.email) {
      return;
    }

    const usersCollectionRef = collection(db, 'Users');
    const docRef = doc(usersCollectionRef, currentUser.email);
    const unsubscribeByEmail = onSnapshot(docRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedUser = {
          ...currentUser,
          calendars: docSnapshot.data().calendars,
        };
        setCurrentUser(updatedUser);
      }
      updateCurrentUser(
        docSnapshot.data()?.userId,
        setCurrentUser,
        setCurrentCalendarId,
        setCurrentCalendarContent,
      );
    });

    return () => {
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
      } else {
        localStorage.removeItem('uid');
        navigate('/');
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedEvent || !selectedEvent.eventId || !currentCalendarId) {
      return;
    }

    const eventDocRef = doc(
      db,
      'Calendars',
      currentCalendarId,
      'events',
      selectedEvent.eventId.toString(),
    );
    const unsubscribeFromEvent = onSnapshot(eventDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const updatedEvent = {
          startAt: docSnapshot.data().startAt.toDate(),
          endAt: docSnapshot.data().endAt.toDate(),
          eventId: docSnapshot.data().eventId,
          title: docSnapshot.data().title,
          isAllDay: docSnapshot.data().isAllDay,
          isMemo: docSnapshot.data().isMemo,
          tag: docSnapshot.data().tag,
          note: docSnapshot.data().note,
          createdAt: docSnapshot.data().createdAt
            ? docSnapshot.data().createdAt.toDate()
            : null,
          updatedAt: docSnapshot.data().updatedAt
            ? docSnapshot.data().updatedAt.toDate()
            : null,
          messages: docSnapshot.data().messages,
        };
        setSelectedEvent(updatedEvent);
      }
    });

    return () => {
      unsubscribeFromEvent();
    };
  }, [selectedEvent?.eventId]);

  return (
    <div className='flex w-screen'>
      <CalendarView />
      <CreateEventModal />
      <EditEventModal />
      <MoreEventModal />
      <AddCalendarModal />
    </div>
  );
}

export default Calendar;
