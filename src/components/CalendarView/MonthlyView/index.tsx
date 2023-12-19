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
  const weeks = splitDatesIntoWeeks(monthDates);

  return (
    <div className='mt-1 w-full border-t'>
      <div className='flex flex-col border-x h-full'>
        <div id='dayCellsWrapper-weekday' className='flex h-10'>
          {weekdays.map((weekday, index) => (
            <Cell
              key={index}
              className='font-bold uppercase grow'
              cellDate={new Date()}
              header
            >
              {weekday}
            </Cell>
          ))}
        </div>

        {weeks.map((week, index) => (
          <div
            key={`week-${index}`}
            id='weekWrapper'
            className='flex-auto relative px-px h-full'
          >
            <div
              id='dayCellsWrapper-weekDates'
              className={clsx('flex h-full min-h-[80px]')}
            >
              {week.map((cellDate, idx) => {
                return (
                  <DroppableArea
                    key={`droppable-${index}-${idx}`}
                    id={`droppable-${index}-${idx}`}
                    date={cellDate}
                  >
                    <Cell
                      className={clsx('grow', {
                        ['text-gray-400']: !isSameMonth(cellDate, currentDate),
                      })}
                      cellDate={cellDate}
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
            </div>

            <EventCells
              splitEvents={splitEvents}
              weekIndex={index}
              week={week}
              dayCounts={monthDates.length}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyView;
