import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useModalStore } from '../../store/modalStore';
import { db } from '../../utils/firebase';
import { Event } from '../../utils/type';

function SideBar() {
  const eventsCollection = collection(
    db,
    'Calendars',
    'nWryB1DvoYBEv1oKdc0L',
    'events',
  );

  const [allEvents, setAllEvents] = useState<Event[]>([]);

  useEffect(() => {
    const orderedEventsCollection = query(
      eventsCollection,
      orderBy('createdAt', 'asc'),
    );

    const unsubscribe = onSnapshot(orderedEventsCollection, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const newEvents = snapshot.docs.map((doc) => ({
            ...doc.data(),
            startAt: doc.data().startAt.toDate(),
            endAt: doc.data().endAt.toDate(),
            // createdAt: doc.data().createdAt.toDate(),
            // updatedAt: doc.data().updatedAt.toDate(),
          })) as Event[];

          setAllEvents(newEvents);
          console.log('Added: ', change.doc.data());
        }
        if (change.type === 'modified') {
          const newEvents = snapshot.docs.map((doc) => ({
            ...doc.data(),
            startAt: doc.data().startAt.toDate(),
            endAt: doc.data().endAt.toDate(),
            // createdAt: doc.data().createdAt.toDate(),
            // updatedAt: doc.data().updatedAt.toDate(),
          })) as Event[];
          setAllEvents(newEvents);
          console.log('Modified: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed: ', change.doc.data());
          setAllEvents((prev) =>
            prev.filter((event) => event.eventId.toString() !== change.doc.id),
          );
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const { isEditModalOpen, setIsEditModalOpen, selectedEvent } =
    useModalStore();

  const handleClick = (event: Event) => {
    setIsEditModalOpen(true, event);
  };

  return (
    <>
      <div className='border-r-3 fixed h-screen w-72 border-slate-300 p-4'>
        Events (old to new)
        <div className='flex flex-col w-fit	gap-1'>
          {allEvents.map((event) => (
            <div
              key={event.eventId}
              className='underline underline-offset-4 cursor-pointer'
              onClick={() => handleClick(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBar;
