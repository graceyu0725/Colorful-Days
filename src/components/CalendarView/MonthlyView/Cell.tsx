import clsx from 'clsx';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  header?: boolean;
}

const Cell: React.FC<Props> = ({
  onClick,
  children,
  className,
  isActive = false,
  header,
}) => {
  return (
    <div
      onClick={!isActive ? onClick : undefined}
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
