import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import clsx from 'clsx';
import {
  addDays,
  addMinutes,
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
import { useState } from 'react';
import toast from 'react-hot-toast';
import { DraggableItem } from '.';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../utils/firebase';
import { themeColors } from '../../utils/theme';
import { Event } from '../../utils/types';

type Props = {
  children: any;
};

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const { currentCalendarId } = useAuthStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const normalBackground =
    themeColors[Number(selectedItem?.tag)]?.darkBackground || 'bg-theme-1-300';

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

  const handleDragStart = ({ active }: DragStartEvent) => {
    setSelectedItem(active.data.current);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!active.data.current) return;

    const overDate = over?.data.current as Date;
    const draggingEvent = active.data.current as Event;

    if (!draggingEvent.startAt) return;
    if (!draggingEvent.endAt) return;

    if (overDate) {
      let newStartDate = overDate;
      let newEndDate = overDate;

      if (draggingEvent.isMemo) {
        const currentTime = serverTimestamp();
        const updatedEvent = {
          ...draggingEvent,
          isMemo: false,
          isAllDay: true,
          startAt: newStartDate,
          endAt: addMinutes(newEndDate,15),
          updatedAt: currentTime,
        };
        await updateEvent(updatedEvent);
        toast.success('Event updated successfully.');
        setSelectedItem(null);
        return;
      }

      if (isSameDay(active.data.current?.startAt, overDate)) return;

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
      toast.success('Event updated successfully.');
      setSelectedItem(null);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}

      <DragOverlay dropAnimation={null} modifiers={[restrictToWindowEdges]}>
        {selectedItem ? (
          <DraggableItem
            key={`overlay-${selectedItem.eventId}`}
            id={`overlay-${selectedItem.eventId}`}
            className={clsx(
              'flex truncate items-center z-30 basis-0 rounded indent-1.5 hover:cursor-pointer text-white hover:-translate-y-px hover:shadow-md',
              normalBackground,
            )}
            event={selectedItem}
            isOverlay
          >
            {selectedItem.title}
          </DraggableItem>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
