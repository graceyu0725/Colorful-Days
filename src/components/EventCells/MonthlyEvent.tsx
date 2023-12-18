import clsx from 'clsx';
import { Event } from '../../utils/types';
import { DraggableItem } from '../DND';

type Props = {
  event: Event;
  backgroundColor: string;
  onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
  gridColumnStart: number;
  gridColumnEnd?: number;
  gridRowStart: number;
  isAllDay?: boolean;
  formattedTime?: string;
};

const MonthlyEvent: React.FC<Props> = ({
  event,
  backgroundColor,
  onClick,
  gridColumnStart,
  gridColumnEnd,
  gridRowStart,
  isAllDay,
  formattedTime,
}) => {
  const content = isAllDay ? (
    <div>{event.title}</div>
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
        'truncate basis-0 rounded indent-1.5 hover:cursor-pointer hover:-translate-y-px hover:shadow-md',
        { ['text-white']: event.isAllDay },
        backgroundColor,
      )}
      style={{
        gridColumnStart: gridColumnStart,
        gridColumnEnd: gridColumnEnd,
        gridRowStart: gridRowStart,
        pointerEvents: 'auto',
      }}
      onClick={onClick}
    >
      {content}
    </DraggableItem>
  );
};

export default MonthlyEvent;
