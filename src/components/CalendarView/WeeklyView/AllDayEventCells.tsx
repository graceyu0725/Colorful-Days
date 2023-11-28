import { useEventsStore } from '../../../store/eventsStore';
import {
  getSplitEvents,
  renderWeeklyAllDayEvent,
} from '../../../utils/handleDatesAndEvents';

type Props = {
  weekDates: Date[];
};

const AllDayEventCells: React.FC<Props> = ({ weekDates }) => {
  const { allEvents } = useEventsStore();

  const spiltEvents = getSplitEvents(weekDates, allEvents);
  const filteredAllDayEvents = spiltEvents[0].map((spiltEvent) =>
    spiltEvent.filter((event) => event.isAllDay === true),
  );
  console.log('filteredAllDayEvents', filteredAllDayEvents);

  interface WrapperProps {
    children: React.ReactNode;
    id: string;
  }

  const WeeklyEventsWrapper: React.FC<WrapperProps> = ({ children }) => (
    <div
      className='gap-px col-start-2 row-start-3 border-b col-span-7 grid grid-cols-7 text-sm mt-2 overflow-auto max-h-16'
      id='weeklyEventsWrapper'
      style={{ pointerEvents: 'none' }}
    >
      {children}
    </div>
  );

  const EventRow: React.FC<WrapperProps> = ({ children }) => (
    <div
      className='grid gap-px col-span-7 grid-cols-7 row-span-1 auto-rows-[20px] w-full'
      // style={{ maxWidth: 'calc(100% - 12px)' }}
      id='eventRow'
    >
      {children}
    </div>
  );

  return (
    <WeeklyEventsWrapper id='weeklyEventsWrapper'>
      <EventRow id='eventRow'>
        {filteredAllDayEvents.map((events, index) =>
          renderWeeklyAllDayEvent(weekDates, index, events),
        )}
      </EventRow>
    </WeeklyEventsWrapper>
  );
};

export default AllDayEventCells;
