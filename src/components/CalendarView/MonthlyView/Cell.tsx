import clsx from 'clsx';
import { useModalStore } from '../../../store/modalStore';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  header?: boolean;
}

const Cell: React.FC<Props> = ({ children, className, header }) => {
  const { isCreateModalOpen, setIsCreateModalOpen } = useModalStore();
  const date: Date = new Date();

  return (
    <div
      onClick={() => setIsCreateModalOpen(true, date)}
      // onClick={!isActive ? onClick : undefined}
      className={clsx(
        'flex select-none flex-col items-start border-b border-r',
        // {
        //   "cursor-pointer hover:bg-gray-100 active:bg-gray-200":
        //     !isActive && onClick,
        // },
        {
          [header
            ? 'h-10 items-center justify-center'
            : 'h-28 px-3 py-2 hover:bg-gray-100 active:bg-gray-200']: true,
        },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Cell;
