import clsx from 'clsx';
import { Event } from '../../utils/types';
import { DraggableItem } from '../Dnd';

type Props = {
  event: Event;
  backgroundColor: string;
  eventCellStyle: string;
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  gridColumnStart?: number;
  gridColumnEnd?: number;
  gridRowStart: number;
  gridRowEnd?: number;
  isAllDay?: boolean;
  formattedTime?: string;
};

const WeeklyEvent: React.FC<Props> = ({
  event,
  backgroundColor,
  eventCellStyle,
  onClick,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  gridRowEnd,
  isAllDay,
  formattedTime,
}) => {
  const content = isAllDay ? (
    <div className='truncate'>{event.title}</div>
  ) : (
    <div className='flex items-center justify-between'>
      <div className='truncate'>{event.title}</div>
      <div className='truncate mr-1 text-xs text-slate-500 mt-1 min-w-fit'>
        {formattedTime}
      </div>
    </div>
  );

  return (
    <DraggableItem
      key={event.eventId}
      id={event.eventId.toString()}
      event={event}
      className={clsx(
        isAllDay
          ? 'rounded hover:-translate-y-px hover:shadow-md'
          : 'indent-1.5 border-l-2 pl-1 truncate hover:cursor-pointer hover:-translate-y-px hover:shadow-md',
        backgroundColor,
        eventCellStyle,
      )}
      style={{
        gridColumnStart: gridColumnStart,
        gridColumnEnd: gridColumnEnd,
        gridRowStart: gridRowStart,
        gridRowEnd: gridRowEnd,
        pointerEvents: 'auto',
      }}
      onClick={onClick}
    >
      {content}
    </DraggableItem>
  );
};

export default WeeklyEvent;
