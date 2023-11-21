import { renderEvent } from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/type';

type Props = {
  splitEvents: Event[][][];
  weekIndex: number;
  week: Date[];
};

const EventCells: React.FC<Props> = ({ splitEvents, weekIndex, week }) => {

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
      id='eventCellsWrapper'
    >
      {children}
    </div>
  );

  const EventRow: React.FC<WrapperProps> = ({ children }) => (
    <div className='flex gap-px' id='eventRow'>
      {children}
    </div>
  );

  return (
    <EventCellsWrapper id='eventCellsWrapper'>
      <EventRow id='eventRow'>
        {splitEvents[weekIndex].map((events, index) =>
          events[0] ? (
            renderEvent(events[0], week[index])
          ) : (
            <div key={index} className='grow'></div>
          ),
        )}
      </EventRow>
      <EventRow id='eventRow'>
        {splitEvents[weekIndex].map((events, index) =>
          events[1] ? (
            renderEvent(events[1], week[index])
          ) : (
            <div className='grow'></div>
          ),
        )}
      </EventRow>
    </EventCellsWrapper>
  );
};

export default EventCells;
