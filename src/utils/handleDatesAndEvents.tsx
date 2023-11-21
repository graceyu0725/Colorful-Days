import { differenceInCalendarDays, getDay, isWithinInterval } from 'date-fns';
import { useModalStore } from '../store/modalStore';
import { Event } from './type';

// ================================================================
// Common functions
// ================================================================

export const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isSameMonth = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
};

export function splitDatesIntoWeeks(monthDates: Date[]) {
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
}

function splitEventsIntoWeeks(mappedEvents: Event[][]) {
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
}

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

// ================================================================
// Deal with logic of displaying events
// ================================================================

// 將所有事件按照當月日期分好（開始日或日期區間落在當格日期，就會成為當格事件）
const mapEventsToMonthDates = (monthDates: Date[], events: Event[]) => {
  const mappedEvents: Event[][] = new Array(monthDates.length)
    .fill(null)
    .map(() => []);

  monthDates.forEach((date, index) => {
    events.forEach((event) => {
      const startDate = event.startAt || new Date();
      const endDate = event.endAt || new Date();
      const isInInterval = isWithinInterval(date, {
        start: startDate,
        end: endDate,
      });

      if (isSameDay(startDate, date) || isInInterval) {
        mappedEvents[index].push(event);
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
// Render one event
// ================================================================

export const renderEvent = (event: Event, cellDate: Date) => {
  const { setIsEditModalOpen } = useModalStore();
  const handleClick = (event: React.MouseEvent, e: Event) => {
    event.stopPropagation(); // 阻止事件冒泡
    setIsEditModalOpen(true, e);
  };

  // 如果是 memo，則不顯示在畫面上
  if (event.isMemo) {
    return <div className='grow basis-0'></div>;
  }

  const startDate = event.startAt || new Date();
  const endDate = event.endAt || new Date();

  // 若事件起始日 = 該格日期，在該格顯示事件標題
  if (isSameDay(startDate, cellDate)) {
    // 起始＆結束為同一天，根據 isAllDay 決定背景透明度
    if (isSameDay(startDate, endDate)) {
      if (event.isAllDay) {
        return (
          <div
            className='w-10 grow bg-red-200 basis-0 rounded indent-1.5 hover:cursor-pointer'
            onClick={(e) => handleClick(e, event)}
          >
            {event.title}
          </div>
        );
      }
      return (
        <div
          className='grow bg-red-50 basis-0 rounded indent-1.5 hover:cursor-pointer'
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }
    const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
    console.log('lastDays', lastDays);

    // 起始＆結束為不同天，根據 事件日期長度 決定要佔的格子數
    // 若 事件日期長度 超過當週可佔據的格子數，則需要斷行
    if (getDay(startDate) + lastDays > 7) {
      return (
        <div
          className='bg-red-200 basis-0 rounded indent-1.5 hover:cursor-pointer'
          style={{ flexGrow: 7 - getDay(startDate) }}
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }
    return (
      <div
        className='bg-red-200 basis-0 rounded indent-1.5 hover:cursor-pointer'
        style={{ flexGrow: lastDays }}
        onClick={(e) => handleClick(e, event)}
      >
        {event.title}
      </div>
    );
  }

  // 若為當週第一天，且事件起始日 != 該格日期，需判斷該格是否有需要接續的事件
  if (getDay(cellDate) === 0) {
    const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
    const lastDaysThisWeek =
      lastDays - differenceInCalendarDays(cellDate, startDate);
    console.log('lastDaysThisWeek', lastDaysThisWeek);
    if (lastDaysThisWeek <= 7) {
      return (
        <div
          className='bg-red-200 basis-0 rounded indent-1.5 hover:cursor-pointer'
          style={{ flexGrow: lastDaysThisWeek }}
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }
    return (
      <div
        className='bg-red-200 basis-0 rounded indent-1.5 hover:cursor-pointer'
        style={{ flexGrow: 7 }}
        onClick={(e) => handleClick(e, event)}
      >
        {event.title}
      </div>
    );
  }

  return <div className='grow-0'></div>;
};
