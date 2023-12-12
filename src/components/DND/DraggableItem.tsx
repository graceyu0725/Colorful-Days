import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import IcBaselineDragIndicator from '~icons/ic/baseline-drag-indicator';
import { Event } from '../../utils/types';

type Props = {
  id: string;
  children: React.ReactNode;
  className: string;
  style: React.CSSProperties;
  onClick: (e: React.MouseEvent) => void;
  event: Event;
};

const DraggableItem: React.FC<Props> = ({
  id,
  children,
  className,
  style,
  onClick,
  event,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
      data: event,
    });

  return (
    <div
      key={id}
      ref={setNodeRef}
      onClick={onClick}
      className={clsx('flex items-center z-30 h-6', className)}
      style={{
        ...style,
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.8 : 1,
      }}
    >
      <IcBaselineDragIndicator
        className='drag-handler h-6 w-5 outline-none'
        {...attributes}
        {...listeners}
      />
      <div className='truncate w-full h-full'>{children}</div>
    </div>
  );
};

export { DraggableItem };
