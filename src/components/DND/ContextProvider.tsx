import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import {
  addDays,
  addSeconds,
  differenceInCalendarDays,
  differenceInSeconds,
  getHours,
  getMinutes,
  isSameDay,
} from 'date-fns';
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../utils/firebase';
import { Event } from '../../utils/types';

type Props = {
  children: any;
};

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const { currentCalendarId } = useAuthStore();

  const updateEvent = async (data: Event) => {
    const eventsCollection = collection(
      db,
      'Calendars',
      currentCalendarId,
      'events',
    );
    const eventRef = doc(eventsCollection, data.eventId.toString());
    const updatedEvent: object = data;
    await updateDoc(eventRef, updatedEvent);
  };

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(PointerSensor),
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!active.data.current) return;

    const overDate = over?.data.current as Date;
    const draggingEvent = active.data.current as Event;

    if (isSameDay(active.data.current?.startAt, overDate)) return;
    if (!draggingEvent.startAt) return;
    if (!draggingEvent.endAt) return;

    if (overDate) {
      let newStartDate = new Date();
      let newEndDate = new Date();

      if (draggingEvent.isAllDay) {
        const durationInDays = differenceInCalendarDays(
          draggingEvent.endAt,
          draggingEvent.startAt,
        );

        newStartDate = overDate;
        newEndDate = addDays(overDate, durationInDays);
      } else {
        const durationInSeconds = differenceInSeconds(
          draggingEvent.endAt,
          draggingEvent.startAt,
        );
        const getNewStartDate = () => {
          let newStartDate = new Date(overDate);
          newStartDate.setHours(getHours(draggingEvent.startAt || new Date()));
          newStartDate.setMinutes(
            getMinutes(draggingEvent.startAt || new Date()),
          );
          return newStartDate;
        };

        newStartDate = getNewStartDate();
        newEndDate = addSeconds(newStartDate, durationInSeconds);
      }

      const currentTime = serverTimestamp();
      const updatedEvent = {
        ...draggingEvent,
        startAt: newStartDate,
        endAt: newEndDate,
        updatedAt: currentTime,
      };
      await updateEvent(updatedEvent);
      toast.success('Event updated successfully!');
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      modifiers={[restrictToWindowEdges]}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
};
