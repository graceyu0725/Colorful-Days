import clsx from 'clsx';
import { useModalStore } from '../../../store/modalStore';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  header?: boolean;
  firstDayOfNextMonth?: number;
  cellDate: Date;
}

const Cell: React.FC<Props> = ({ children, className, header, cellDate }) => {
  const { setIsCreateModalOpen } = useModalStore();

  return (
    <div
      id='cell'
      onClick={() => {
        if (!header) {
          setIsCreateModalOpen(true, cellDate, cellDate, false);
        }
      }}
      className={clsx(
        'flex select-none flex-col items-start border-b text-sm w-full',
        {
          [header
            ? 'h-10 px-2 justify-center'
            : 'h-full px-2 py-1 hover:bg-slate-100 active:bg-slate-200']: true,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Cell;
