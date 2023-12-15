import { useDraggable } from '@dnd-kit/core';
import clsx from 'clsx';
import IcBaselineDragIndicator from '~icons/ic/baseline-drag-indicator';
import { Event } from '../../utils/types';

type Props = {
  id: string;
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  event: Event;
  isOverlay?: boolean;
};

const DraggableItem: React.FC<Props> = ({
  id,
  children,
  className,
  style,
  onClick,
  event,
  isOverlay,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: event,
  });

  return (
    <>
      {isOverlay ? (
        <div
          id={id}
          className={clsx(
            'flex items-center z-50',
            className,
            event.isMemo ? 'h-12 rounded-lg p-3' : 'h-6',
          )}
          style={{
            ...style,
            opacity: isDragging ? 0.5 : 1,
          }}
        >
          <IcBaselineDragIndicator className='drag-handler h-6 w-5 outline-none' />
          <div className='truncate w-full h-full'>{children}</div>
        </div>
      ) : (
        <div
          id={id}
          ref={setNodeRef}
          onClick={onClick}
          className={clsx(
            'flex items-center z-50',
            className,
            event.isMemo ? 'h-10' : 'h-6',
          )}
          style={{
            ...style,
            opacity: isDragging ? 0.5 : 1,
          }}
        >
          <IcBaselineDragIndicator
            className='drag-handler h-6 w-5 outline-none'
            {...attributes}
            {...listeners}
          />
          <div className='truncate w-full h-full'>{children}</div>
        </div>
      )}
    </>
  );
};

export { DraggableItem };
