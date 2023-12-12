import clsx from 'clsx';
import { isSameDay, isSameMonth } from 'date-fns';
import { useAuthStore } from '../../../store/authStore';
import { useEventsStore } from '../../../store/eventsStore';
import { useViewStore } from '../../../store/viewStore';
import {
  generateMonthDates,
  getSplitEvents,
  splitDatesIntoWeeks,
} from '../../../utils/handleDatesAndEvents';
import { DroppableArea } from '../../DND';
import Cell from './Cell';
import EventCells from './EventCells';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyView: React.FC = () => {
  const { currentDate } = useViewStore();
  const { currentThemeColor } = useAuthStore();

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
            >
              {weekday}
            </Cell>
          ))}
        </DayCellsWrapper>

        {weeks.map((week, index) => (
          <WeekWrapper id='weekWrapper' key={`week-${index}`}>
            <DayCellsWrapper id='dayCellsWrapper'>
              {week.map((cellDate, idx) => {
                return (
                  <DroppableArea id={cellDate.toDateString()} date={cellDate}>
                    <Cell
                      key={`${index}-${idx}`}
                      className={clsx('grow', {
                        ['text-gray-400']: !isSameMonth(cellDate, currentDate),
                      })}
                      cellDate={cellDate}
                      dayCounts={monthDates.length}
                    >
                      <div
                        className={clsx('w-5 h-5 text-center', {
                          [`${currentThemeColor.darkBackground} rounded-full text-white`]:
                            isSameDay(cellDate, new Date()),
                        })}
                      >
                        {cellDate.getDate()}
                      </div>
                    </Cell>
                  </DroppableArea>
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
