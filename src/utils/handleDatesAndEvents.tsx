import clsx from 'clsx';
import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  format,
  getDay,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
} from 'date-fns';
import MonthlyEvent from '../components/EventCells/MonthlyEvent';
import WeeklyEvent from '../components/EventCells/WeeklyEvent';
import { themeColors } from './theme';
import { Event } from './types';

export const updateAllEvents = (
  snapshot: any,
  setCalendarAllEvents: (event: Event[]) => void,
  selectedEvent?: Event,
  setSelectedEvent?: (event: Event) => void,
) => {
  const newEvents = snapshot.docs.map((doc: any) => {
    const eventData = {
      ...doc.data(),
      startAt: doc.data().startAt.toDate(),
      endAt: doc.data().endAt.toDate(),
    };

    if (
      selectedEvent &&
      setSelectedEvent &&
      doc.data().eventId === selectedEvent.eventId
    ) {
      setSelectedEvent(eventData);
    }
    return eventData;
  }) as Event[];

  setCalendarAllEvents(newEvents);
};

function splitIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  let chunks: T[][] = [];
  let currentChunk: T[] = [];

  array.forEach((item, index) => {
    currentChunk.push(item);

    if (currentChunk.length === chunkSize || index === array.length - 1) {
      chunks.push(currentChunk);
      currentChunk = [];
    }
  });

  return chunks;
}

export const splitDatesIntoWeeks = (monthDates: Date[]) => {
  return splitIntoChunks(monthDates, 7);
};

export const getMonthDates = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  const lastDateOfLastMonth = new Date(year, month, 0).getDate();
  const dates = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(
      new Date(year, month - 1, lastDateOfLastMonth - firstDayOfMonth + i + 1),
    );
  }

  for (let i = 1; i <= lastDateOfMonth; i++) {
    dates.push(new Date(year, month, i));
  }

  const daysInLastRow = 7 - (dates.length % 7);
  if (daysInLastRow < 7) {
    for (let i = 1; i <= daysInLastRow; i++) {
      dates.push(new Date(year, month + 1, i));
    }
  }

  return dates;
};

export const getWeekDates = (date: Date) => {
  const firstDateOfWeek = startOfWeek(date);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(firstDateOfWeek, i));
  }
  return dates;
};

export const getCellStartTime = (
  date: Date[],
  weekdayIndex: number,
  timeIndex: number,
  minute: number,
) => {
  const startTime = new Date(
    date[weekdayIndex].getFullYear(),
    date[weekdayIndex].getMonth(),
    date[weekdayIndex].getDate(),
    timeIndex,
    minute,
  );
  return startTime;
};

const filterEventsForDay = (events: Event[], date: Date): Event[] => {
  return events.filter((event) => {
    const startDate = event.startAt || new Date();
    const endDate = event.endAt || new Date();
    return (
      isWithinInterval(date, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      }) && !event.isMemo
    );
  });
};

const sortEventsByStartDateAndDuration = (events: Event[]): Event[] => {
  return events.sort((a, b) => {
    if (!a.startAt || !b.startAt) {
      return !a.startAt ? 1 : -1;
    }

    const startComparison = a.startAt.getTime() - b.startAt.getTime();
    if (startComparison !== 0) {
      return startComparison;
    }

    if (!a.endAt || !b.endAt) {
      return !a.endAt ? 1 : -1;
    }

    const durationA = a.endAt.getTime() - a.startAt.getTime();
    const durationB = b.endAt.getTime() - b.startAt.getTime();
    return durationB - durationA;
  });
};

const mapEventsForDay = (
  eventsOfTheDay: Event[],
  dayIndex: number,
  mappedEvents: Event[][],
  eventIndices: Map<string, number>,
) => {
  eventsOfTheDay.forEach((event) => {
    if (!event.eventId) return;

    if (eventIndices.has(event.eventId.toString())) {
      const eventIndex = eventIndices.get(event.eventId.toString());

      if (eventIndex && !mappedEvents[dayIndex][eventIndex]) {
        mappedEvents[dayIndex][eventIndex] = event;
      } else {
        mappedEvents[dayIndex].push(event);
        eventIndices.set(
          event.eventId.toString(),
          mappedEvents[dayIndex].length - 1,
        );
      }
    } else {
      const emptyIndex = mappedEvents[dayIndex].findIndex((e) => !e);
      if (emptyIndex !== -1) {
        mappedEvents[dayIndex][emptyIndex] = event;
      } else {
        mappedEvents[dayIndex].push(event);
      }
      eventIndices.set(
        event.eventId.toString(),
        emptyIndex >= 0 ? emptyIndex : mappedEvents[dayIndex].length - 1,
      );
    }
  });
};

const mapEventsToMonthDates = (monthDates: Date[], events: Event[]) => {
  const mappedEvents: Event[][] = monthDates.map(() => []);
  const eventIndices = new Map();

  monthDates.forEach((date, index) => {
    const eventsOfTheDay = filterEventsForDay(events, date);
    const sortedEvents = sortEventsByStartDateAndDuration(eventsOfTheDay);
    mapEventsForDay(sortedEvents, index, mappedEvents, eventIndices);
  });

  return mappedEvents;
};

export const getSplitEvents = (monthDates: Date[], allEvents: Event[]) => {
  const mappedEvents = mapEventsToMonthDates(monthDates, allEvents);
  const splitEvents = splitIntoChunks(mappedEvents, 7);
  return splitEvents;
};

export const renderMonthlyEvents = (
  event: any,
  cellDate: Date,
  eventIndex: number,
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void,
) => {
  if (event.isMemo || !event) return;

  const startDate = event.startAt || new Date();
  const endDate = event.endAt || new Date();
  const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
  const normalBackground = themeColors[Number(event.tag)].darkBackground;
  const lightBackground = themeColors[Number(event.tag)].lightBackground;

  const isEventStartDay = isSameDay(startDate, cellDate);
  const isStartOfWeek = getDay(cellDate) === 0;

  const backgroundColor = event.isAllDay
    ? normalBackground
    : isSameDay(startDate, endDate)
      ? lightBackground
      : normalBackground;

  const getGridColumnEnd = () => {
    if (isEventStartDay) {
      return getDay(startDate) + lastDays > 7
        ? 8
        : getDay(startDate) + 1 + lastDays;
    }

    const lastDaysThisWeek =
      lastDays - differenceInCalendarDays(cellDate, startDate);
    return lastDaysThisWeek <= 7 ? lastDaysThisWeek + 1 : 8;
  };

  const handleOpenEditModal = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setIsEditModalOpen(true, event);
  };

  if (isEventStartDay || isStartOfWeek) {
    return (
      <MonthlyEvent
        key={event.eventId}
        event={event}
        backgroundColor={backgroundColor}
        onClick={(e) => handleOpenEditModal(e, event)}
        gridColumnStart={isEventStartDay ? getDay(startDate) + 1 : 1}
        gridColumnEnd={getGridColumnEnd()}
        gridRowStart={eventIndex + 1}
        isAllDay={event.isAllDay}
        formattedTime={event.isAllDay ? undefined : format(startDate, 'HH:mm')}
      />
    );
  }
};

const commonCellStyle =
  'truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5';
const eventCellStyles = [
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

export const renderWeeklyAllDayEvent = (
  weekDates: Date[],
  index: number,
  events: (Event | null)[],
  setIsMoreModalOpen: (isOpen: boolean, events: (Event | null)[]) => void,
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void,
) => {
  return events.map((event, eventIndex) => {
    if (!event || event.isMemo || eventIndex > 2) return;
    if (eventIndex === 2) {
      return (
        <div
          className='truncate border-2 border-slate-200 text-xs text-center w-10 rounded hover:cursor-pointer'
          style={{
            gridRowStart: 3,
            gridColumnStart: index + 1,
            pointerEvents: 'auto',
          }}
          onClick={() => setIsMoreModalOpen(true, events)}
        >
          more
        </div>
      );
    }

    const startDate = event.startAt || new Date();
    const endDate = event.endAt || new Date();
    const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
    const lastDayThisWeek =
      lastDays - differenceInCalendarDays(weekDates[index], startDate);
    const normalBackground = themeColors[Number(event.tag)].darkBackground;

    const isEventStartDay = isSameDay(startDate, weekDates[index]);
    const isStartOfWeek = getDay(weekDates[index]) === 0;

    const gridColumnEnd = isEventStartDay
      ? getDay(startDate) + lastDays > 7
        ? 8
        : getDay(startDate) + 1 + lastDays
      : lastDayThisWeek > 7
        ? 8
        : lastDayThisWeek + 1;

    if (isEventStartDay || isStartOfWeek) {
      return (
        <WeeklyEvent
          key={event.eventId}
          event={event}
          backgroundColor={normalBackground}
          eventCellStyle={clsx(eventCellStyles[index], commonCellStyle)}
          onClick={() => setIsEditModalOpen(true, event)}
          gridColumnStart={isEventStartDay ? getDay(startDate) + 1 : 1}
          gridColumnEnd={gridColumnEnd}
          gridRowStart={eventIndex + 1}
          isAllDay
        />
      );
    }
  });
};

const calculateGridRows = (
  startDate: Date,
  endDate: Date,
  columnDate: Date,
) => {
  const MAX_GRID_ROWS = 97;
  const startDiffMinutes =
    Math.abs(startDate.getTime() - startOfDay(columnDate).getTime()) / 60000;
  const endDiffMinutes = isSameDay(startDate, columnDate)
    ? Math.abs(startDate.getTime() - endDate.getTime()) / 60000
    : Math.abs(endDate.getTime() - startOfDay(columnDate).getTime()) / 60000;
  const startRowIndex = 1 + Math.ceil(startDiffMinutes / 15);
  const rowSpanNumber = Math.ceil(endDiffMinutes / 15);

  return {
    start: isSameDay(startDate, columnDate) ? startRowIndex : 1,
    end: isSameDay(startDate, endDate)
      ? startRowIndex + rowSpanNumber
      : isSameDay(endDate, columnDate)
        ? 1 + rowSpanNumber
        : MAX_GRID_ROWS,
  };
};

const isMidnight = (date: Date | null) =>
  date?.getHours() === 0 && date.getMinutes() === 0;

export const renderWeeklyOneDayEvent = (
  columnDate: Date,
  event: Event,
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void,
) => {
  if (
    !event.title ||
    event.isMemo ||
    (!isSameDay(event.startAt || new Date(), event.endAt || new Date()) &&
      isSameDay(event.endAt || new Date(), columnDate) &&
      isMidnight(event.endAt))
  )
    return;

  const { lightBackground, border } = themeColors[Number(event.tag)];
  const { start, end } = calculateGridRows(
    event.startAt || new Date(),
    event.endAt || new Date(),
    columnDate,
  );

  return (
    <WeeklyEvent
      key={event.eventId}
      event={event}
      backgroundColor={lightBackground}
      eventCellStyle={border}
      onClick={() => setIsEditModalOpen(true, event)}
      gridRowStart={start}
      gridRowEnd={end}
    />
  );
};
