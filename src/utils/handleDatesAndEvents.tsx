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
import { useModalStore } from '../store/modalStore';
import { themeColors } from './theme';
import { Event } from './types';

// ================================================================
// Common functions
// ================================================================
export const updateAllEvents = (
  snapshot: any,
  setAllEvents: (event: Event[]) => void,
  selectedEvent?: Event,
  setSelectedEvent?: (event: Event) => void,
) => {
  console.log('updateAllEvents');
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

  setAllEvents(newEvents);
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
  // const mappedEvents: Event[][] = new Array(monthDates.length)
  //   .fill(null)
  //   .map(() => []);

  // monthDates.forEach((date, index) => {
  //   events.forEach((event) => {
  //     const startDate = event.startAt || new Date();
  //     const endDate = event.endAt || new Date();
  //     const isInInterval = isWithinInterval(date, {
  //       start: startDate,
  //       end: endDate,
  //     });

  //     if (isSameDay(startDate, date) || isInInterval) {
  //       mappedEvents[index].push(event);
  //     }
  //   });

  // });

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

export const renderEvent = (event: any, cellDate: Date, eventIndex: number) => {
  const { setIsEditModalOpen } = useModalStore();
  const handleClick = (event: React.MouseEvent, e: Event) => {
    event.stopPropagation(); // 阻止事件冒泡
    setIsEditModalOpen(true, e);
  };

  // 如果是 memo，則不顯示在畫面上
  if (event.isMemo || !event) return;
  // if (event.isMemo) {
  //   return <div className=''></div>;
  // }

  const startDate = event.startAt || new Date();
  const endDate = event.endAt || new Date();

  const normalBackground = themeColors[Number(event.tag)].bg;
  const lightBackground = themeColors[Number(event.tag)].light;

  // 若事件起始日 = 該格日期，在該格顯示事件標題
  if (isSameDay(startDate, cellDate)) {
    // 起始＆結束為同一天，根據 isAllDay 決定背景透明度
    if (isSameDay(startDate, endDate)) {
      // ALL-DAY
      if (event.isAllDay) {
        return (
          <div
            className={clsx(
              'truncate basis-0 rounded indent-1.5 hover:cursor-pointer',
              normalBackground,
            )}
            style={{
              gridColumnStart: getDay(startDate) + 1,
              gridRowStart: eventIndex + 1,
              pointerEvents: 'auto',
            }}
            onClick={(e) => handleClick(e, event)}
          >
            {event.title}
          </div>
        );
      }

      // SAME-DAY
      const formattedTime = format(startDate, 'h:mm a');
      return (
        <div
          className={clsx(
            'truncate basis-0 rounded indent-1.5 hover:cursor-pointer flex items-center justify-between',
            lightBackground,
          )}
          style={{
            gridColumnStart: getDay(startDate) + 1,
            gridRowStart: eventIndex + 1,
            pointerEvents: 'auto',
          }}
          onClick={(e) => handleClick(e, event)}
        >
          <div className='truncate'>{event.title}</div>
          <div className='truncate mr-1 text-xs text-slate-500'>
            {formattedTime}
          </div>
        </div>
      );
    }
    const lastDays = differenceInCalendarDays(endDate, startDate) + 1;

    // 起始＆結束為不同天，根據 事件日期長度 決定要佔的格子數
    // 若 事件日期長度 超過當週可佔據的格子數，則需要斷行
    if (getDay(startDate) + lastDays > 7) {
      return (
        <div
          className={clsx(
            'truncate basis-0 rounded indent-1.5 hover:cursor-pointer',
            normalBackground,
          )}
          // style={{ flexGrow: 7 - getDay(startDate) }}
          style={{
            gridColumnStart: getDay(startDate) + 1,
            gridColumnEnd: 8,
            gridRowStart: eventIndex + 1,
            pointerEvents: 'auto',
          }}
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }
    return (
      <div
        className={clsx(
          'truncate basis-0 rounded indent-1.5 hover:cursor-pointer',
          normalBackground,
        )}
        // style={{ flexGrow: lastDays }}
        style={{
          gridColumnStart: getDay(startDate) + 1,
          gridColumnEnd: getDay(startDate) + 1 + lastDays,
          gridRowStart: eventIndex + 1,
          pointerEvents: 'auto',
        }}
        onClick={(e) => handleClick(e, event)}
      >
        {event.title}
      </div>
    );
  }

  // 若為當週第一天，且事件起始日 != 該格日期，需判斷該格是否有需要接續的事件
  if (getDay(cellDate) === 0) {
    console.log('遇到跨週事件');
    const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
    const lastDaysThisWeek =
      lastDays - differenceInCalendarDays(cellDate, startDate);
    if (lastDaysThisWeek <= 7) {
      return (
        <div
          className={clsx(
            'truncate basis-0 rounded indent-1.5 hover:cursor-pointer',
            normalBackground,
          )}
          // style={{ flexGrow: lastDaysThisWeek }}
          style={{
            gridColumnStart: 1,
            gridColumnEnd: lastDaysThisWeek + 1,
            gridRowStart: eventIndex + 1,
            pointerEvents: 'auto',
          }}
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }
    return (
      <div
        className={clsx(
          'truncate basis-0 rounded indent-1.5 hover:cursor-pointer',
          normalBackground,
        )}
        style={{
          gridColumnStart: 1,
          gridColumnEnd: 8,
          gridRowStart: eventIndex + 1,
          pointerEvents: 'auto',
        }}
        onClick={(e) => handleClick(e, event)}
      >
        {event.title}
      </div>
    );
  }

  if (event.title) {
    // return <div className=''>{event.title}</div>;
  }
};

// ================================================================
// Render weekly events
// ================================================================

const eventCellStyles = [
  'col-start-1 px-2 truncate max-h-5 hover:cursor-pointer',
  'col-start-2 px-2 truncate max-h-5 hover:cursor-pointer',
  'col-start-3 px-2 truncate max-h-5 hover:cursor-pointer',
  'col-start-4 px-2 truncate max-h-5 hover:cursor-pointer',
  'col-start-5 px-2 truncate max-h-5 hover:cursor-pointer',
  'col-start-6 px-2 truncate max-h-5 hover:cursor-pointer',
  'col-start-7 px-2 truncate max-h-5 hover:cursor-pointer',
];

// 傳入的事件已經篩選過，皆為 all-day 事件
export const renderWeeklyAllDayEvent = (
  weekDates: Date[],
  index: number,
  events: (Event | null)[],
) => {
  const { setIsEditModalOpen } = useModalStore();
  const handleClick = (event: React.MouseEvent, e: Event) => {
    event.stopPropagation(); // 阻止事件冒泡
    setIsEditModalOpen(true, e);
  };

  return events.map((event, eventIndex) => {
    if (!event || event.isMemo || eventIndex > 2) return;

    const startDate = event.startAt || new Date();
    const endDate = event.endAt || new Date();

    if (eventIndex === 2) {
      return (
        <div
          className='truncate border-2 border-slate-200 text-xs text-center w-10 rounded hover:cursor-pointer'
          style={{
            gridRowStart: 3,
            gridColumnStart: index + 1,
            pointerEvents: 'auto',
          }}
          onClick={() => console.log('more', events)}
        >
          more
        </div>
      );
    }

    const normalBackground = themeColors[Number(event.tag)].bg;

    // 事件起始日 = 該格日期
    if (isSameDay(startDate, weekDates[index])) {
      // 起始日與結束日不同天，代表是多日事件
      if (!isSameDay(startDate, endDate)) {
        const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
        // 事件長度超過當週可 render 長度，僅能 render 到當週最後一天
        if (getDay(startDate) + lastDays > 7) {
          return (
            <div
              className={clsx(eventCellStyles[index], {
                ['rounded']: event.title,
                [normalBackground]: event.title,
              })}
              style={{
                gridColumnStart: getDay(startDate) + 1,
                gridColumnEnd: 8,
                gridRowStart: eventIndex + 1,
                pointerEvents: 'auto',
              }}
              onClick={(e) => handleClick(e, event)}
            >
              {event.title}
            </div>
          );
        }
        // 事件長度若沒有超過當週可 render 長度，就 render 事件實際持續天數
        return (
          <div
            className={clsx(eventCellStyles[index], {
              ['rounded']: event.title,
              [normalBackground]: event.title,
            })}
            style={{
              gridColumnStart: getDay(startDate) + 1,
              gridColumnEnd: getDay(startDate) + 1 + lastDays,
              gridRowStart: eventIndex + 1,
              pointerEvents: 'auto',
            }}
            onClick={(e) => handleClick(e, event)}
          >
            {event?.title}
          </div>
        );
      }
      return (
        <div
          className={clsx(eventCellStyles[index], {
            ['rounded']: event.title,
            [normalBackground]: event.title,
          })}
          style={{
            pointerEvents: 'auto',
            gridRowStart: eventIndex + 1,
          }}
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }

    // 若為當週第一天，且事件起始日 != 該格日期，需判斷該格是否有需要接續的事件
    if (getDay(weekDates[index]) === 0) {
      const lastDays = differenceInCalendarDays(endDate, startDate) + 1;
      const lastDayThisWeek =
        lastDays - differenceInCalendarDays(weekDates[index], startDate);
      if (lastDayThisWeek <= 7) {
        return (
          <div
            className={clsx(eventCellStyles[index], {
              ['rounded']: event.title,
              [normalBackground]: event.title,
            })}
            style={{
              gridColumnStart: 1,
              gridColumnEnd: lastDayThisWeek + 1,
              gridRowStart: eventIndex + 1,
              pointerEvents: 'auto',
            }}
            onClick={(e) => handleClick(e, event)}
          >
            {event?.title}
          </div>
        );
      }
      return (
        <div
          className={clsx(eventCellStyles[index], {
            ['rounded']: event.title,
            [normalBackground]: event.title,
          })}
          style={{
            gridColumnStart: 1,
            gridColumnEnd: 8,
            gridRowStart: eventIndex + 1,
            pointerEvents: 'auto',
          }}
          onClick={(e) => handleClick(e, event)}
        >
          {event?.title}
        </div>
      );
    }
  });
};

// ----------------------------------------------------------------
// 傳入的事件已經篩選過，皆為 one-day 事件

export const renderWeeklyOneDayEvent = (
  columnDate: Date,
  event: Event,
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void,
) => {
  // 沒有事件
  if (!event.title || event.isMemo) return;

  const handleClick = (event: React.MouseEvent, e: Event) => {
    event.stopPropagation(); // 阻止事件冒泡
    setIsEditModalOpen(true, e);
  };

  const startDate = event.startAt || new Date();
  const endDate = event.endAt || new Date();
  const borderColor = themeColors[Number(event.tag)].border;
  const lightBackground = themeColors[Number(event.tag)].light;

  // 起始日 = 該格日期下
  // 若起始日 = 結束日，按事件時間 render， 若起始日 ！= 結束日，起始日當天 render 所有格子
  if (isSameDay(startDate, columnDate)) {
    const startRowIndex =
      1 +
      Math.ceil(
        Math.abs(startDate.getTime() - startOfDay(columnDate).getTime()) /
          60000 /
          15,
      );
    const rowSpanNumber = Math.ceil(
      Math.abs(startDate.getTime() - endDate.getTime()) / 60000 / 15,
    );

    if (isSameDay(startDate, endDate)) {
      return (
        <div
          className={clsx(
            'border-l-2 pl-1 truncate hover:cursor-pointer',
            borderColor,
            lightBackground,
          )}
          style={{
            gridRowStart: startRowIndex,
            gridRowEnd: startRowIndex + rowSpanNumber,
            pointerEvents: 'auto',
          }}
          onClick={(e) => handleClick(e, event)}
        >
          {event.title}
        </div>
      );
    }
    return (
      <div
        className={clsx(
          'border-l-2 pl-1 truncate hover:cursor-pointer',
          borderColor,
          lightBackground,
        )}
        style={{
          gridRowStart: startRowIndex,
          gridRowEnd: 97,
          pointerEvents: 'auto',
        }}
        onClick={(e) => handleClick(e, event)}
      >
        {event.title}
      </div>
    );
  }

  if (isSameDay(endDate, columnDate)) {
    const isMidnight = endDate.getHours() === 0 && endDate.getMinutes() === 0;
    if (isMidnight) return;

    const rowSpanNumber = Math.ceil(
      Math.abs(endDate.getTime() - startOfDay(columnDate).getTime()) /
        60000 /
        15,
    );
    return (
      <div
        className={clsx(
          'border-l-2 pl-1 truncate hover:cursor-pointer',
          borderColor,
          lightBackground,
        )}
        style={{
          gridRowStart: 1,
          gridRowEnd: 1 + rowSpanNumber,
          pointerEvents: 'auto',
        }}
        onClick={(e) => handleClick(e, event)}
      >
        {event.title}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'border-l-2 pl-1 truncate hover:cursor-pointer',
        borderColor,
        lightBackground,
      )}
      style={{
        gridRowStart: 1,
        gridRowEnd: 97,
        pointerEvents: 'auto',
      }}
      onClick={(e) => handleClick(e, event)}
    >
      {event.title}
    </div>
  );
};
