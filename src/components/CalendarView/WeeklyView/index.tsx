import clsx from 'clsx';
import { isFirstDayOfMonth, isSameDay, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useModalStore } from '../../../store/modalStore';
import { useViewStore } from '../../../store/viewStore';
import { generateWeekDates } from '../../../utils/handleDatesAndEvents';
import AllDayEventCells from './AllDayEventCells';
import OneDayEventCells from './OneDayEventCells';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const commonTimeStyles =
  'row-span-2 col-start-1 relative -top-3 pl-4 text-slate-500 text-sm';
const timeStyles = [
  { time: '', style: clsx('row-start-1', commonTimeStyles) },
  { time: '1 AM', style: clsx('row-start-3', commonTimeStyles) },
  { time: '2 AM', style: clsx('row-start-5', commonTimeStyles) },
  { time: '3 AM', style: clsx('row-start-7', commonTimeStyles) },
  { time: '4 AM', style: clsx('row-start-9', commonTimeStyles) },
  { time: '5 AM', style: clsx('row-start-11', commonTimeStyles) },
  { time: '6 AM', style: clsx('row-start-13', commonTimeStyles) },
  { time: '7 AM', style: clsx('row-start-15', commonTimeStyles) },
  { time: '8 AM', style: clsx('row-start-17', commonTimeStyles) },
  { time: '9 AM', style: clsx('row-start-19', commonTimeStyles) },
  { time: '10 AM', style: clsx('row-start-21', commonTimeStyles) },
  { time: '11 AM', style: clsx('row-start-23', commonTimeStyles) },
  { time: '12 PM', style: clsx('row-start-25', commonTimeStyles) },
  { time: '1 PM', style: clsx('row-start-27', commonTimeStyles) },
  { time: '2 PM', style: clsx('row-start-29', commonTimeStyles) },
  { time: '3 PM', style: clsx('row-start-31', commonTimeStyles) },
  { time: '4 PM', style: clsx('row-start-33', commonTimeStyles) },
  { time: '5 PM', style: clsx('row-start-35', commonTimeStyles) },
  { time: '6 PM', style: clsx('row-start-37', commonTimeStyles) },
  { time: '7 PM', style: clsx('row-start-39', commonTimeStyles) },
  { time: '8 PM', style: clsx('row-start-41', commonTimeStyles) },
  { time: '9 PM', style: clsx('row-start-43', commonTimeStyles) },
  { time: '10 PM', style: clsx('row-start-45', commonTimeStyles) },
  {
    time: '11 PM',
    style: clsx('row-start-47 border-b -mb-3', commonTimeStyles),
  },
];
const commonDateStyles =
  'row-start-2 row-span-2 border-t pl-2 pt-1 -mr-px text-sm hover:bg-slate-100';
const dateStyles = [
  clsx('col-start-2 border-r', commonDateStyles),
  clsx('col-start-3 border-r', commonDateStyles),
  clsx('col-start-4 border-r', commonDateStyles),
  clsx('col-start-5 border-r', commonDateStyles),
  clsx('col-start-6 border-r', commonDateStyles),
  clsx('col-start-7 border-r', commonDateStyles),
  clsx('col-start-8 ml-px', commonDateStyles),
];

const WeeklyView: React.FC = () => {
  const { currentDate } = useViewStore();
  const weekDates = generateWeekDates(currentDate);
  const { setIsCreateModalOpen } = useModalStore();
  const { currentThemeColor } = useAuthStore();

  const getStartTime = (
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

  const [topPosition, setTopPosition] = useState(0);
  useEffect(() => {
    const updatePosition = () => {
      const today = startOfToday();
      const now = new Date();
      const minutesPassed = (now.getTime() - today.getTime()) / 60000;
      const pixelsPerMinute = 1.6;
      setTopPosition(minutesPassed * pixelsPerMinute);
    };

    const intervalId = setInterval(updatePosition, 60000);
    updatePosition();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      id='weekly-view-root'
      className='flex flex-col border-x border-t w-full mt-1'
    >
      <div
        id='weekly-view-header'
        className='w-full min-h-[120px] bg-gray-50 grid grid-rows-weeklyHeader grid-cols-weeklyHeader'
      >
        <div className='col-start-1'></div>
        <div className='col-start-2 pl-1 text-sm font-bold'>Sun</div>
        <div className='col-start-3 pl-1 text-sm font-bold'>Mon</div>
        <div className='col-start-4 pl-1 text-sm font-bold'>Tue</div>
        <div className='col-start-5 pl-1 text-sm font-bold'>Wed</div>
        <div className='col-start-6 pl-1 text-sm font-bold'>Thu</div>
        <div className='col-start-7 pl-1 text-sm font-bold'>Fri</div>
        <div className='col-start-8 pl-1 text-sm font-bold'>Sat</div>

        {weekDates.map((weekDate, index) => (
          <div
            key={index}
            className={dateStyles[index]}
            onClick={() => setIsCreateModalOpen(true, weekDate, weekDate, true)}
          >
            <div
              className={
                isSameDay(new Date(), weekDate)
                  ? 'w-5 text-center rounded-full bg-amber-800 text-white'
                  : ''
              }
            >
              {isFirstDayOfMonth(weekDate)
                ? `${weekDate.getMonth() + 1}/${weekDate.getDate()}`
                : weekDate.getDate()}
            </div>
          </div>
        ))}

        <div className='col-start-1 row-start-3 border-b pl-4 text-sm mt-2'>
          All-day
        </div>
        {/* 這裡用來放整日的時間  */}
        <AllDayEventCells weekDates={weekDates} />

        {/* <div className='col-start-2 row-start-3 border-b col-span-7 grid grid-cols-7 text-sm mt-2'>
          <div>Event rowwww Events</div>
        </div> */}
      </div>

      {/* 一個大 Grid 包含左邊時間列及中間 Time table，Time table 也需要一個 Grid */}
      <div
        id='weekly-view-time-table'
        className='relative w-full grid grid-cols-weeklyTimeTable grid-rows-weeklyTimeTable overflow-scroll pr-[14px]'
      >
        {/* 時間線 */}
        <div
          className={clsx(
            'absolute w-full border-t top-1 right-0 z-20',
            currentThemeColor.border,
          )}
          style={{ width: 'calc(100% - 80px)', top: `${topPosition}px` }}
        ></div>

        {/* 左邊時間列 */}
        {timeStyles.map((timeStyle, index) => (
          <time key={index} className={timeStyle.style}>
            {timeStyle.time}
          </time>
        ))}

        {weekdays.map((weekday, weekdayIndex) => (
          <>
            <div
              key={weekdayIndex}
              id={`column-${weekday}`}
              className='relative border-l column-start-2 row-start-1 row-span-full column-span-1 grid grid-rows-weeklyTimeTable z-10'
            >
              {/* 用來放空白格子，點擊可新增事件 */}
              {timeStyles.map((timeStyle, index) => (
                <>
                  <div
                    key={`row-1-${timeStyle}-${index}`}
                    className='border-b border-dashed hover:bg-slate-50'
                    onClick={() =>
                      setIsCreateModalOpen(
                        true,
                        getStartTime(weekDates, weekdayIndex, index, 0),
                        getStartTime(weekDates, weekdayIndex, index + 1, 0),
                        false,
                      )
                    }
                  ></div>
                  <div
                    key={`row-2-${index}`}
                    className='border-b hover:bg-slate-50'
                    onClick={() =>
                      setIsCreateModalOpen(
                        true,
                        getStartTime(weekDates, weekdayIndex, index, 30),
                        getStartTime(weekDates, weekdayIndex, index + 1, 30),
                        false,
                      )
                    }
                  ></div>
                </>
              ))}

              {/* 用來放事件格子 */}
              {/* div內用來渲染每一天的事件 */}
              {/* <div
                key={weekdayIndex}
                id={`column-${weekday}`}
                className='absolute left-0 w-11/12 bg-red-50/50 column-start-2 row-start-1 row-span-full column-span-1 grid grid-rows-weeklyTimeTable z-10'
              > */}
              <OneDayEventCells
                weekDates={weekDates}
                weekdayIndex={weekdayIndex}
              />
              {/* </div> */}
            </div>
          </>
        ))}
        {/* Time Table Grid - 7 columns */}
      </div>
    </div>
  );
};

export default WeeklyView;
