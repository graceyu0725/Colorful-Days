import clsx from 'clsx';
import { useModalStore } from '../../../store/modalStore';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  header?: boolean;
  dayCounts: number;
  firstDayOfNextMonth?: number;
  cellDate: Date;
  date: Date;
}

const Cell: React.FC<Props> = ({
  children,
  className,
  header,
  dayCounts,
  date,
  cellDate,
}) => {
  const { setIsCreateModalOpen } = useModalStore();

  return (
    <div
      id='cell'
      onClick={() => {
        if (!header) {
          setIsCreateModalOpen(true, cellDate);
          console.log('cellDate:', cellDate, date);
        }
      }}
      className={clsx(
        'flex select-none flex-col items-start border-b  text-sm w-5',
        {
          [header
            ? 'h-10 items-center justify-center'
            : dayCounts > 35
              ? 'h-24 px-2 py-1 hover:bg-gray-200 active:bg-gray-200'
              : 'h-28 px-2 py-1 hover:bg-gray-200 active:bg-gray-200']: true,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Cell;
