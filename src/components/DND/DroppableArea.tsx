import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

type Props = {
  id: string;
  date: Date;
  children: React.ReactNode;
  className?: string;
};

const DroppableArea: React.FC<Props> = ({ id, date, children, className }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: date,
  });

  return (
    <div
      id={id}
      ref={setNodeRef}
      className={clsx(
        'grow',
        isOver ? 'bg-slate-100 transition-colors' : '',
        className,
      )}
    >
      {children}
    </div>
  );
};

export { DroppableArea };
