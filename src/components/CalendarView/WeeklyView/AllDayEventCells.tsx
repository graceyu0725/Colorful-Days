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
  const { setIsMoreModalOpen, setIsEditModalOpen } = useModalStore();

  const spiltEvents = getSplitEvents(weekDates, allEvents);

  const filterAllDayEvents = (weekEvents: Event[][]): Event[][] => {
    return weekEvents.map((dayEvents) =>
      dayEvents.filter((event) => event && event.isAllDay),
    );
  };

  const filteredAllDayEvents = filterAllDayEvents(spiltEvents[0]);

  return (
    <div
      id='weeklyEventsWrapper'
      className='gap-px col-start-2 row-start-3 border-b col-span-7 grid grid-cols-7 text-sm mt-2 overflow-y-visible max-h-18 pb-px'
      style={{ pointerEvents: 'none' }}
    >
      <div
        id='eventRow'
        className='grid gap-0.5 col-span-7 grid-cols-7 row-span-1 auto-rows-[20px] w-full'
      >
        {filteredAllDayEvents.map((events, index) =>
          renderWeeklyAllDayEvent(
            weekDates,
            index,
            events,
            setIsMoreModalOpen,
            setIsEditModalOpen,
          ),
        )}
      </div>
    </div>
  );
};

export default AllDayEventCells;
