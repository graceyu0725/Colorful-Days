import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';

type Props = {
  id: string;
  date: Date;
  children: React.ReactNode;
};

const DroppableArea: React.FC<Props> = ({ id, date, children }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: date,
  });

  return (
    <div
      ref={setNodeRef}
      className={clsx('grow', isOver ? 'bg-slate-100' : '')}
    >
      {children}
    </div>
  );
};

export { DroppableArea };
