import clsx from 'clsx';
import {
  addMinutes,
  isFirstDayOfMonth,
  isSameDay,
  startOfToday,
} from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useModalStore } from '../../../store/modalStore';
import { useViewStore } from '../../../store/viewStore';
import {
  getCellStartTime,
  getWeekDates,
} from '../../../utils/handleDatesAndEvents';
import { DroppableArea } from '../../Dnd';
import AllDayEventCells from './AllDayEventCells';
import OneDayEventCells from './OneDayEventCells';

const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = 1440;
const MILLISECONDS_PER_MINUTE = 60000;
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const commonTimeStyles =
  'text-end row-span-2 col-start-1 relative -top-3 px-4 text-slate-500 text-sm';
const commonDateStyles =
  'col-span-1 row-start-2 row-span-2 border-t pl-1 pt-1 -mr-px text-sm hover:bg-slate-100';
const dateStyles = [
  'col-start-2 border-r',
  'col-start-3 border-r',
  'col-start-4 border-r',
  'col-start-5 border-r',
  'col-start-6 border-r',
  'col-start-7 border-r',
  'col-start-8 ml-px',
];

const WeeklyView: React.FC = () => {
  const { currentThemeColor } = useAuthStore();
  const { currentDate } = useViewStore();
  const { setIsCreateModalOpen } = useModalStore();

  const weekDates = useMemo(() => {
    return getWeekDates(currentDate);
  }, [currentDate]);

  const startTimeList = useMemo(
    () =>
      weekDates.map((_, weekdayIndex) =>
        Array.from({ length: HOURS_PER_DAY * 2 }).map((_, timeIndex) => {
          const hour = Math.floor(timeIndex / 2);
          const minute = timeIndex % 2 === 0 ? 0 : 30;
          return getCellStartTime(weekDates, weekdayIndex, hour, minute);
        }),
      ),
    [weekDates],
  );

  const [topPosition, setTopPosition] = useState(MINUTES_PER_DAY);
  useEffect(() => {
    const updatePosition = () => {
      const today = startOfToday();
      const now = new Date();
      const minutesPassed =
        (now.getTime() - today.getTime()) / MILLISECONDS_PER_MINUTE;
      const pixelsPerMinute = 1.6;
      setTopPosition(minutesPassed * pixelsPerMinute);
    };

    const intervalId = setInterval(updatePosition, MILLISECONDS_PER_MINUTE);
    updatePosition();

    return () => clearInterval(intervalId);
  }, []);

  const renderHeaderDates = () => {
    return (
      <>
        <div className='col-start-1 border-r -mr-px' />
        {weekdays.map((weekday, index) => (
          <div key={index} className='col-start-auto pl-1 text-sm font-bold'>
            {weekday}
          </div>
        ))}
        <div className='col-start-1 row-start-2 border-r -mr-px z-10' />
        {weekDates.map((weekDate, index) => (
          <DroppableArea
            key={`droppable-weeklyAllDay-${index}`}
            id={`droppable-weeklyAllDay-${index}`}
            date={weekDate}
            className={clsx(commonDateStyles, dateStyles[index])}
          >
            <div
              className='w-full h-full'
              onClick={() =>
                setIsCreateModalOpen(true, weekDate, weekDate, true)
              }
            >
              <div
                className={clsx('w-5 h-5 text-center', {
                  [`${currentThemeColor.darkBackground} rounded-full text-white w-5 text-center`]:
                    isSameDay(weekDate, new Date()),
                })}
              >
                {isFirstDayOfMonth(weekDate)
                  ? `${weekDate.getMonth() + 1}/${weekDate.getDate()}`
                  : weekDate.getDate()}
              </div>
            </div>
          </DroppableArea>
        ))}

        <div className='col-start-1 row-start-3 border-b border-r pl-4 text-sm pt-2 -mr-px'>
          All-day
        </div>
      </>
    );
  };

  const renderCurrentTimeline = () => {
    return (
      <div
        className={clsx(
          'absolute w-full border-t top-1 right-0 z-20',
          currentThemeColor.border,
        )}
        style={{ width: 'calc(100% - 80px)', top: `${topPosition}px` }}
      />
    );
  };

  const renderSideTimeLabel = () => {
    const formatHour = (hour: number) => {
      if (hour === 0) return '';
      if (hour < 12) return `${hour} AM`;
      if (hour === 12) return `12 PM`;
      return `${hour - 12} PM`;
    };

    const getRowStartClass = (hour: number) => {
      if (hour === 0) return 'row-start-1';
      if (hour === 23) return 'row-start-auto border-b -mb-3';
      return 'row-start-auto';
    };

    return Array.from({ length: HOURS_PER_DAY }, (_, index) => index).map(
      (hour) => (
        <time
          key={hour}
          className={clsx(commonTimeStyles, getRowStartClass(hour))}
        >
          {formatHour(hour)}
        </time>
      ),
    );
  };

  const renderTimeTable = () => {
    return weekdays.map((weekday, weekdayIndex) => (
      <div
        key={`column-${weekday}`}
        id={`column-${weekday}`}
        className='relative border-l column-start-2 row-start-1 row-span-full column-span-1 grid grid-rows-weeklyTimeTable z-10'
      >
        {Array.from({ length: HOURS_PER_DAY * 2 }).map((_, index) => (
          <DroppableArea
            key={`droppable-weeklyOneDay-${weekdayIndex}-${index}`}
            id={`droppable-weeklyOneDay-${weekdayIndex}-${index}`}
            date={startTimeList[weekdayIndex][index]}
            className='border-b border-dashed hover:bg-slate-100'
          >
            <div
              className='w-full h-full'
              onClick={() => {
                setIsCreateModalOpen(
                  true,
                  startTimeList[weekdayIndex][index],
                  addMinutes(startTimeList[weekdayIndex][index], 15),
                  false,
                );
              }}
            />
          </DroppableArea>
        ))}

        <OneDayEventCells weekDates={weekDates} weekdayIndex={weekdayIndex} />
      </div>
    ));
  };

  return (
    <div
      id='weekly-view-root'
      className='flex flex-col border-x border-t w-full mt-1'
    >
      <div
        id='weekly-view-header'
        className='w-full min-h-[120px] bg-gray-50 grid grid-rows-weeklyHeader grid-cols-weeklyHeader'
      >
        {renderHeaderDates()}
        <AllDayEventCells weekDates={weekDates} />
      </div>

      <div
        id='weekly-view-time-table'
        className='relative w-full grid grid-cols-weeklyTimeTable grid-rows-weeklyTimeTable overflow-y-scroll'
      >
        {renderCurrentTimeline()}
        {renderSideTimeLabel()}
        {renderTimeTable()}
      </div>
    </div>
  );
};

export default WeeklyView;
