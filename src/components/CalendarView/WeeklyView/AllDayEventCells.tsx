import { useEventsStore } from '../../../store/eventsStore';
import { useModalStore } from '../../../store/modalStore';
import {
  getSplitEvents,
  renderWeeklyAllDayEvent,
} from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/types';

type Props = {
  weekDates: Date[];
};

const AllDayEventCells: React.FC<Props> = ({ weekDates }) => {
  const { allEvents } = useEventsStore();
  const { setIsMoreModalOpen } = useModalStore();

  const spiltEvents = getSplitEvents(weekDates, allEvents);

  // const filterAllDayEvents = (weekEvents: Event[][]) => {
  //   return weekEvents.map((dayEvents) =>
  //     dayEvents.map((event) =>
  //       event === null || event.isAllDay ? event : null,
  //     ),
  //   );
  // };

  const filterAllDayEvents = (weekEvents: Event[][]): Event[][] => {
    return weekEvents.map((dayEvents) =>
      dayEvents.filter((event) => event && event.isAllDay),
    );
  };

  const filteredAllDayEvents = filterAllDayEvents(spiltEvents[0]);

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
          renderWeeklyAllDayEvent(weekDates, index, events, setIsMoreModalOpen),
        )}
      </EventRow>
    </WeeklyEventsWrapper>
  );
};

export default AllDayEventCells;
