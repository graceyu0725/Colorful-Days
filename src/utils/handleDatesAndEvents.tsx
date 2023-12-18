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

// ================================================================
// Common functions
// ================================================================
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

export const splitDatesIntoWeeks = (monthDates: Date[]) => {
  let weeks: Array<Array<Date>> = [];
  let week: Date[] = [];

  monthDates.forEach((date, index) => {
    week.push(date);

    if (week.length === 7 || index === monthDates.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return weeks;
};

const splitEventsIntoWeeks = (mappedEvents: Event[][]) => {
  let weeks: Event[][][] = [];
  let week: Event[][] = [];

  mappedEvents.forEach((event, index) => {
    week.push(event);

    if (week.length === 7 || index === mappedEvents.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return weeks;
};

// ================================================================
// Deal with logic of generating dates
// ================================================================

// 把當月所有日期存在一個陣列中，用來渲染日曆格子
export const generateMonthDates = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  const lastDateOfLastMonth = new Date(year, month, 0).getDate();
  const dates = [];

  // 前一個月的最後幾天
  for (let i = 0; i < firstDayOfMonth; i++) {
    dates.push(
      new Date(year, month - 1, lastDateOfLastMonth - firstDayOfMonth + i + 1),
    );
  }

  // 當前月份的所有日期
  for (let i = 1; i <= lastDateOfMonth; i++) {
    dates.push(new Date(year, month, i));
  }

  // 下個月的開始幾天
  const daysInLastRow = 7 - (dates.length % 7);
  if (daysInLastRow < 7) {
    for (let i = 1; i <= daysInLastRow; i++) {
      dates.push(new Date(year, month + 1, i));
    }
  }

  return dates;
};

export const generateWeekDates = (date: Date) => {
  const firstDateOfWeek = startOfWeek(date);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(firstDateOfWeek, i));
  }
  return dates;
};

// ================================================================
// Deal with logic of displaying events
// ================================================================

// 將所有事件按照當月日期分好（開始日或日期區間落在當格日期，就會成為當格事件）
const mapEventsToMonthDates = (monthDates: Date[], events: Event[]) => {
  const mappedEvents: Event[][] = monthDates.map(() => []);
  const eventIndices = new Map();

  monthDates.forEach((date, index) => {
    const eventsOfTheDay = events.filter((event) => {
      const startDate = event.startAt || new Date();
      const endDate = event.endAt || new Date();
      const isInInterval = isWithinInterval(date, {
        start: startOfDay(startDate),
        end: endOfDay(endDate),
      });
      return isInInterval && !event.isMemo;
    });

    // 先按照開始日期排序，再按照持續時間排
    eventsOfTheDay.sort((a, b) => {
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

    mappedEvents[index] = mappedEvents[index] || [];

    eventsOfTheDay.forEach((event) => {
      if (!event.eventId) return;

      if (eventIndices.has(event.eventId)) {
        // If the event already appeared, use the same index
        const eventIndex = eventIndices.get(event.eventId);

        if (!mappedEvents[index][eventIndex]) {
          mappedEvents[index][eventIndex] = event;
        } else {
          // 若該位置已被佔用，加到 array 尾
          mappedEvents[index].push(event);
          eventIndices.set(event.eventId, mappedEvents[index].length - 1);
        }
      } else {
        const emptyIndex = mappedEvents[index].findIndex((e) => !e);
        if (emptyIndex !== -1) {
          mappedEvents[index][emptyIndex] = event;
        } else {
          mappedEvents[index].push(event);
        }
        eventIndices.set(
          event.eventId,
          emptyIndex >= 0 ? emptyIndex : mappedEvents[index].length - 1,
        );
      }
    });
  });

  return mappedEvents;
};

// 輸出整理過後的事件
export const getSplitEvents = (monthDates: Date[], allEvents: Event[]) => {
  const mappedEvents = mapEventsToMonthDates(monthDates, allEvents);
  const splitEvents = splitEventsIntoWeeks(mappedEvents);
  return splitEvents;
};

// ================================================================
// Render monthly events
// ================================================================

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

  const handleClick = (e: React.MouseEvent, event: Event) => {
    e.stopPropagation();
    setIsEditModalOpen(true, event);
  };

  // 若事件起始日 = 該格日期，在該格顯示事件標題
  // 起始＆結束為同一天，根據 isAllDay 決定背景透明度
  // 起始＆結束為不同天，根據 事件日期長度 決定要佔的格子數
  // 若 事件日期長度 超過當週可佔據的格子數，則需要斷行
  if (isSameDay(startDate, cellDate)) {
    return (
      <MonthlyEvent
        key={event.eventId}
        event={event}
        backgroundColor={
          event.isAllDay
            ? normalBackground
            : isSameDay(startDate, endDate)
              ? lightBackground
              : normalBackground
        }
        onClick={(e) => handleClick(e, event)}
        gridColumnStart={getDay(startDate) + 1}
        gridColumnEnd={
          getDay(startDate) + lastDays > 7
            ? 8
            : getDay(startDate) + 1 + lastDays
        }
        gridRowStart={eventIndex + 1}
        isAllDay={event.isAllDay}
        formattedTime={event.isAllDay ? undefined : format(startDate, 'HH:mm')}
      />
    );
  }

  // 若為當週第一天，且事件起始日 != 該格日期，需判斷該格是否有需要接續的事件
  if (getDay(cellDate) === 0) {
    const lastDaysThisWeek =
      lastDays - differenceInCalendarDays(cellDate, startDate);
    return (
      <MonthlyEvent
        key={event.eventId}
        event={event}
        backgroundColor={normalBackground}
        onClick={(e) => handleClick(e, event)}
        gridColumnStart={1}
        gridColumnEnd={lastDaysThisWeek <= 7 ? lastDaysThisWeek + 1 : 8}
        gridRowStart={eventIndex + 1}
      />
    );
  }
};

// ================================================================
// Render weekly events
// ================================================================

const eventCellStyles = [
  'col-start-1 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
  'col-start-2 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
  'col-start-3 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
  'col-start-4 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
  'col-start-5 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
  'col-start-6 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
  'col-start-7 truncate max-h-[20px] hover:cursor-pointer text-white indent-1.5',
];

// 傳入的事件已經篩選過，皆為 all-day 事件
export const renderWeeklyAllDayEvent = (
  weekDates: Date[],
  index: number,
  events: (Event | null)[],
  setIsMoreModalOpen: (isOpen: boolean, events: (Event | null)[]) => void,
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void,
) => {
  const handleClick = (event: React.MouseEvent, e: Event) => {
    event.stopPropagation();
    setIsEditModalOpen(true, e);
  };

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
    const normalBackground = themeColors[Number(event.tag)].darkBackground;

    // 事件起始日 = 該格日期
    // 起始日與結束日不同天，代表是多日事件
    // 事件長度超過當週可 render 長度，僅能 render 到當週最後一天
    // 事件長度若沒有超過當週可 render 長度，就 render 事件實際持續天數
    if (isSameDay(startDate, weekDates[index])) {
      return (
        <WeeklyEvent
          key={event.eventId}
          event={event}
          backgroundColor={normalBackground}
          eventCellStyle={eventCellStyles[index]}
          onClick={(e) => handleClick(e, event)}
          gridColumnStart={getDay(startDate) + 1}
          gridColumnEnd={
            getDay(startDate) + lastDays > 7
              ? 8
              : getDay(startDate) + 1 + lastDays
          }
          gridRowStart={eventIndex + 1}
          isAllDay
        />
      );
    }

    // 若為當週第一天，且事件起始日 != 該格日期，需判斷該格是否有需要接續的事件
    if (getDay(weekDates[index]) === 0) {
      const lastDayThisWeek =
        lastDays - differenceInCalendarDays(weekDates[index], startDate);
      return (
        <WeeklyEvent
          key={event.eventId}
          event={event}
          backgroundColor={normalBackground}
          eventCellStyle={eventCellStyles[index]}
          onClick={(e) => handleClick(e, event)}
          gridColumnStart={1}
          gridColumnEnd={lastDayThisWeek <= 7 ? lastDayThisWeek + 1 : 8}
          gridRowStart={eventIndex + 1}
          isAllDay
        />
      );
    }
  });
};

// ----------------------------------------------------------------
// 傳入的事件已經篩選過，皆為 one-day 事件
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

  const handleClick = (event: React.MouseEvent, e: Event) => {
    event.stopPropagation();
    setIsEditModalOpen(true, e);
  };

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
      onClick={(e) => handleClick(e, event)}
      gridRowStart={start}
      gridRowEnd={end}
    />
  );
};
