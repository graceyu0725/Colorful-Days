import { getDay } from 'date-fns';
import { useModalStore } from '../../../store/modalStore';
import { renderEvent } from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/types';

type Props = {
  splitEvents: Event[][][];
  weekIndex: number;
  week: Date[];
};

const EventCells: React.FC<Props> = ({ splitEvents, weekIndex, week }) => {
  const { setIsMoreModalOpen } = useModalStore();

  // ================================================================
  // Handle rendering
  // ================================================================
  interface WrapperProps {
    children: React.ReactNode;
    id: string;
  }

  const EventCellsWrapper: React.FC<WrapperProps> = ({ children }) => (
    <div
      className='absolute flex flex-col w-full top-7 gap-y-1'
      style={{ pointerEvents: 'none' }}
      id='eventCellsWrapper'
    >
      {children}
    </div>
  );

  const EventRow: React.FC<WrapperProps> = ({ children }) => (
    <div className='grid gap-px grid-cols-7 auto-rows-auto' id='eventRow'>
      {children}
    </div>
  );
  
  return (
    <EventCellsWrapper id='eventCellsWrapper'>
      <EventRow id='eventRow'>
        {splitEvents[weekIndex].map((events, eventsIndex) =>
          events.map((event, eventIndex) =>
            eventIndex < 2 ? (
              event ? (
                renderEvent(event, week[eventsIndex], eventIndex)
              ) : null
            ) : eventIndex === 2 && !event.isMemo ? (
              <div
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
      </EventRow>
    </EventCellsWrapper>
  );
};

export default EventCells;
