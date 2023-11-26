import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect } from 'react';
import { create } from 'zustand';
import { db } from '../utils/firebase';
import { Event } from '../utils/types';

// TODO: replace calendarId with a real id

const eventsCollection = collection(
  db,
  'Calendars',
  'nWryB1DvoYBEv1oKdc0L',
  'events',
);

interface eventsState {
  allEvents: Event[];
  setAllEvents: (event: Event[]) => void;
}

export const useEventsStore = create<eventsState>((set) => ({
  allEvents: [],
  setAllEvents: (event) => set({ allEvents: event }),
}));

const updateAllEvents = (
  snapshot: any,
  setAllEvents: (event: Event[]) => void,
) => {
  const newEvents = snapshot.docs.map((doc: any) => ({
    ...doc.data(),
    startAt: doc.data().startAt.toDate(),
    endAt: doc.data().endAt.toDate(),
  })) as Event[];
  setAllEvents(newEvents);
};

export const getAllEvents = () => {
  const { setAllEvents } = useEventsStore();

  useEffect(() => {
    const orderedEventsCollection = query(
      eventsCollection,
      orderBy('createdAt', 'asc'),
    );

    const unsubscribe = onSnapshot(orderedEventsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          console.log('Added: ', change.doc.data());
          updateAllEvents(snapshot, setAllEvents);
        }
        if (change.type === 'modified') {
          console.log('Modified: ', change.doc.data());
          updateAllEvents(snapshot, setAllEvents);
        }
        if (change.type === 'removed') {
          console.log('Removed: ', change.doc.data());
          updateAllEvents(snapshot, setAllEvents);
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
