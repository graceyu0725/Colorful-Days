import clsx from 'clsx';
import { useModalStore } from '../../../store/modalStore';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  header?: boolean;
  dayCounts?: number;
}

const Cell: React.FC<Props> = ({ children, className, header, dayCounts }) => {
  const { setIsCreateModalOpen } = useModalStore();
  const date: Date = new Date();
  console.log('dayCounts:', dayCounts);

  return (
    <div
      onClick={() => setIsCreateModalOpen(true, date)}
      className={clsx(
        'flex select-none flex-col items-start border-b border-r text-sm',
        {
          [header
            ? 'h-10 items-center justify-center'
            : dayCounts && dayCounts > 35
              ? 'h-24 px-3 py-2 hover:bg-gray-200 active:bg-gray-200'
              : 'h-28 px-3 py-2 hover:bg-gray-200 active:bg-gray-200']: true,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Cell;
