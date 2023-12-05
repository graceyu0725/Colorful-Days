import { useEventsStore } from '../../../store/eventsStore';
import {
  getSplitEvents,
  renderWeeklyOneDayEvent,
} from '../../../utils/handleDatesAndEvents';
import { useModalStore } from '../../../store/modalStore';

type Props = {
  weekDates: Date[];
  weekdayIndex: number;
};

const OneDayEventCells: React.FC<Props> = ({ weekDates, weekdayIndex }) => {
  const { allEvents } = useEventsStore();
  const { setIsEditModalOpen } = useModalStore();

  const spiltEvents = getSplitEvents(weekDates, allEvents);
  const filteredOneDayEvents = spiltEvents[0].map((spiltEvent) =>
    spiltEvent.filter((event) => event.isAllDay === false),
  );

  interface WrapperProps {
    children: React.ReactNode;
    id: string;
  }

  const WeeklyEventsWrapper: React.FC<WrapperProps> = ({ children }) => (
    <div
      className='absolute left-0 w-11/12 column-start-2 row-start-1 row-span-full column-span-1 grid grid-rows-weeklyOneDayEvents auto-cols-fr z-10'
      id={`weeklyEventsWrapper-${weekDates[
        weekdayIndex
      ].getMonth()}-${weekDates[weekdayIndex].getDate()}`}
      style={{ pointerEvents: 'none' }}
    >
      {children}
    </div>
  );

  return (
    <WeeklyEventsWrapper
      id={`weeklyEventsWrapper-${weekDates[
        weekdayIndex
      ].getMonth()}-${weekDates[weekdayIndex].getDate()}`}
    >
      {filteredOneDayEvents[weekdayIndex].map((event) =>
        renderWeeklyOneDayEvent(
          weekDates[weekdayIndex],
          event,
          setIsEditModalOpen,
        ),
      )}
    </WeeklyEventsWrapper>
  );
};

export default OneDayEventCells;
