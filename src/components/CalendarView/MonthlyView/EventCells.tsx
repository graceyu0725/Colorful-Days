import { getDay } from 'date-fns';
import { useModalStore } from '../../../store/modalStore';
import { renderMonthlyEvents } from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/types';

type Props = {
  splitEvents: Event[][][];
  weekIndex: number;
  week: Date[];
};

const EventCells: React.FC<Props> = ({ splitEvents, weekIndex, week }) => {
  const { setIsMoreModalOpen, setIsEditModalOpen } = useModalStore();

  return (
    <div
      id='eventCellsWrapper'
      className='absolute flex flex-col w-full top-7 gap-y-1'
      style={{ pointerEvents: 'none' }}
    >
      <div id='eventRow' className='grid gap-0.5 grid-cols-7 auto-rows-auto'>
        {splitEvents[weekIndex].map((events, eventsIndex) =>
          events.map((event, eventIndex) =>
            eventIndex < 2 ? (
              event ? (
                renderMonthlyEvents(
                  event,
                  week[eventsIndex],
                  eventIndex,
                  setIsEditModalOpen,
                )
              ) : null
            ) : eventIndex === 2 && !event.isMemo ? (
              <div
                key={event.eventId}
                className='truncate border-2 border-slate-200 text-xs text-center w-10 rounded hover:cursor-pointer'
                style={{
                  gridColumnStart: getDay(week[eventsIndex]) + 1,
                  pointerEvents: 'auto',
                }}
                onClick={() => setIsMoreModalOpen(true, events)}
              >
                more
              </div>
            ) : null,
          ),
        )}
      </div>
    </div>
  );
};

export default EventCells;
