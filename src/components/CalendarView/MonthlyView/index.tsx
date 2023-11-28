import clsx from 'clsx';
import { isSameDay, isSameMonth } from 'date-fns';
import { useState } from 'react';
import { useEventsStore } from '../../../store/eventsStore';
import { useViewStore } from '../../../store/viewStore';
import {
  generateMonthDates,
  getSplitEvents,
  splitDatesIntoWeeks,
} from '../../../utils/handleDatesAndEvents';
import Cell from './Cell';
import EventCells from './EventCells';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyView: React.FC = () => {
  const { currentDate } = useViewStore();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const { allEvents } = useEventsStore();

  // 生成當前月份的日期陣列 []
  const monthDates: Date[] = generateMonthDates(currentYear, currentMonth);
  const splitEvents = getSplitEvents(monthDates, allEvents);

  // 用 Wrapper 包住日曆格子＆事件格子
  interface WrapperProps {
    children: React.ReactNode;
    id: string;
  }

  interface CalendarViewProps {
    monthDates: Date[];
  }

  const WeekWrapper: React.FC<WrapperProps> = ({ children }) => (
    <div className='flex-auto relative px-px' id='weekWrapper'>
      {children}
    </div>
  );

  const DayCellsWrapper: React.FC<WrapperProps> = ({ children }) => (
    <div className='flex w-ull' id='dayCellsWrapper'>
      {children}
    </div>
  );

  // 處理日曆格子的選取
  const weeks = splitDatesIntoWeeks(monthDates);
  const convertDatesToFalse = (weeks: Date[][]) => {
    return weeks.map((week) => week.map(() => false));
  };
  const initialIsMouseDown = convertDatesToFalse(weeks);
  const [isMouseDown, setIsMouseDown] = useState(initialIsMouseDown);
  const [startCell, setStartCell] = useState([0, 0]);
  // const mouseDown = (row: number, col: number, cellDate: Date) => {
  //   let newArray = isMouseDown.map((innerArray) => [...innerArray]);
  //   newArray[row][col] = true;
  //   setIsMouseDown(newArray);
  //   setSelectedStartDate(cellDate);
  //   console.log('newArray', newArray);
  // };

  // const mouseOver = (row: number, col: number, cellDate: Date) => {
  //   if (isMouseDown.some((r) => r.includes(true))) {
  //     let newArray = isMouseDown.map((innerArray) => [...innerArray]);
  //     for (let i = 0; i <= row; i++) {
  //       for (let j = 0; j < newArray[i].length; j++) {
  //         if (i < row || j <= col) {
  //           newArray[i][j] = true;
  //         }
  //       }
  //     }
  //     setIsMouseDown(newArray);
  //   }
  // };

  // const mouseUp = (cellDate: Date) => {
  //   setIsMouseDown(convertDatesToFalse(weeks));
  //   setIsCreateModalOpen(true, selectedStartDate, cellDate);
  // };

  // 生成日曆格子，每一週用 DayCellWrapper 包住 DayCells
  const CalendarView: React.FC<CalendarViewProps> = ({ monthDates }) => {
    const weeks = splitDatesIntoWeeks(monthDates);

    return (
      <div className='flex flex-col border-x'>
        <DayCellsWrapper id='dayCellsWrapper'>
          {weekdays.map((weekday, index) => (
            <Cell
              key={index}
              className='font-bold uppercase grow'
              cellDate={new Date()}
              dayCounts={monthDates.length}
              header
              isMouseDown={isMouseDown}
              setIsMouseDown={setIsMouseDown}
              row={index}
              col={index}
              initialIsMouseDown={initialIsMouseDown}
              startCell={startCell}
              setStartCell={setStartCell}
              // isSelected={false}
            >
              {weekday}
            </Cell>
          ))}
        </DayCellsWrapper>

        {weeks.map((week, index) => (
          <WeekWrapper id='weekWrapper'>
            <DayCellsWrapper key={`week-${index}`} id='dayCellsWrapper'>
              {week.map((cellDate, idx) => {
                return (
                  <Cell
                    key={`${index}-${idx}`}
                    className={clsx(
                      'grow',
                      {
                        ['text-gray-400']: !isSameMonth(cellDate, currentDate),
                      },
                      // {
                      //   ['bg-gray-200']: isMouseDown[index],
                      // },
                    )}
                    cellDate={cellDate}
                    dayCounts={monthDates.length}
                    isMouseDown={isMouseDown}
                    setIsMouseDown={setIsMouseDown}
                    row={index}
                    col={idx}
                    initialIsMouseDown={initialIsMouseDown}
                    startCell={startCell}
                    setStartCell={setStartCell}
                    // isSelected={isMouseDown[index][idx]}
                  >
                    <div
                      className={clsx('w-5 h-5 text-center', {
                        [isSameDay(cellDate, new Date())
                          ? 'rounded-full bg-amber-800 text-white'
                          : '']: true,
                      })}
                    >
                      {cellDate.getDate()}
                    </div>
                  </Cell>
                );
              })}
            </DayCellsWrapper>

            <EventCells
              splitEvents={splitEvents}
              weekIndex={index}
              week={week}
            />
          </WeekWrapper>
        ))}
      </div>
    );
  };

  return (
    <div className='mt-1 w-full border-t'>{CalendarView({ monthDates })}</div>
  );
};

export default MonthlyView;
