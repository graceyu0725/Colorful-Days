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
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import { db } from '../../utils/firebase';
import { themeColors } from '../../utils/theme';
import { Event } from '../../utils/types';

type Props = {
  children: any;
};

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const { currentView } = useViewStore();
  const { currentCalendarId } = useAuthStore();
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const normalBackground =
    themeColors[Number(selectedItem?.tag)]?.darkBackground || 'bg-theme-1-300';
  const lightBackground =
    themeColors[Number(selectedItem?.tag)]?.lightBackground || 'bg-theme-1-100';

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
          endAt: addMinutes(newEndDate, 15),
          updatedAt: currentTime,
        };
        await updateEvent(updatedEvent);
        toast.success('Event updated successfully');
        setSelectedItem(null);
        return;
      }

      if (draggingEvent.isAllDay) {
        if (isSameDay(draggingEvent.startAt, overDate)) return;

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
          if (currentView === CalendarViewCategory.Monthly) {
            newStartDate.setHours(
              getHours(draggingEvent.startAt || new Date()),
            );
            newStartDate.setMinutes(
              getMinutes(draggingEvent.startAt || new Date()),
            );
          }
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
      toast.success('Event updated successfully');
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
            key={`${selectedItem.eventId}`}
            id={`${selectedItem.eventId}`}
            className={clsx(
              'flex truncate z-30 basis-0 rounded indent-1.5 hover:cursor-pointer hover:-translate-y-px hover:shadow-md',
              !selectedItem.isAllDay &&
                isSameDay(selectedItem.startAt, selectedItem.endAt)
                ? `${lightBackground} text-slate-500`
                : currentView === CalendarViewCategory.Monthly
                  ? `${normalBackground} text-white`
                  : `${lightBackground} text-slate-500`,
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
