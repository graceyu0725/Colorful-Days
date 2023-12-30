import { getDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { useModalStore } from '../../../store/modalStore';
import { renderMonthlyEvents } from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/types';

type Props = {
  splitEvents: Event[][][];
  weekIndex: number;
  week: Date[];
  dayCounts: number;
};

const EventCells: React.FC<Props> = ({
  splitEvents,
  weekIndex,
  week,
  dayCounts,
}) => {
  const { setIsMoreModalOpen, setIsEditModalOpen } = useModalStore();
  const [maxEventIndex, setMaxEventIndex] = useState(2);

  useEffect(() => {
    function handleResize() {
      const windowHeight = window.innerHeight;
      const baseHeight = 600;
      const increment = dayCounts > 35 ? 160 : 120;
      const indexIncrement = Math.floor(
        (windowHeight - baseHeight) / increment,
      );
      const newIndex = Math.max(1, 1 + indexIncrement);

      setMaxEventIndex(newIndex);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      id='eventCellsWrapper'
      className='absolute flex flex-col w-full top-7 gap-y-1'
      style={{ pointerEvents: 'none' }}
    >
      <div id='eventRow' className='grid gap-0.5 grid-cols-7 auto-rows-auto'>
        {splitEvents[weekIndex].map((events, eventsIndex) =>
          events.map((event, eventIndex) =>
            eventIndex < maxEventIndex ? (
              event ? (
                renderMonthlyEvents(
                  event,
                  week[eventsIndex],
                  eventIndex,
                  setIsEditModalOpen,
                )
              ) : null
            ) : eventIndex === maxEventIndex && !event.isMemo ? (
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
