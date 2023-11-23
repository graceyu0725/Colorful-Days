import clsx from 'clsx';
import { useModalStore } from '../../../store/modalStore';
// import { useState } from 'react';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  header?: boolean;
  dayCounts: number;
  firstDayOfNextMonth?: number;
  cellDate: Date;
  date: Date;
  isMouseDown: boolean[][];
  initialIsMouseDown: boolean[][];
  setIsMouseDown: React.Dispatch<React.SetStateAction<boolean[][]>>;
  row: number;
  col: number;
  startCell: number[];
  setStartCell: React.Dispatch<React.SetStateAction<number[]>>;
  // isSelected: boolean;
}

const Cell: React.FC<Props> = ({
  children,
  className,
  header,
  dayCounts,
  date,
  cellDate,
  isMouseDown,
  setIsMouseDown,
  initialIsMouseDown,
  row,
  col,
  startCell,
  setStartCell,
  // isSelected,
}) => {
  const { setIsCreateModalOpen, setSelectedStartDate, selectedStartDate } =
    useModalStore();
  // const [isSelected,setIsSelected] = useState(false)

  const mouseDown = () => {
    if (!header) {
      let newArray = isMouseDown.map((innerArray) => [...innerArray]);
      newArray[row][col] = true;
      setIsMouseDown(newArray);
      setSelectedStartDate(cellDate);
      setStartCell([row, col]);
    }
  };

  const mouseOver = () => {
    if (!header) {
      if (isMouseDown.some((r) => r.includes(true))) {
        let newArray = isMouseDown.map((innerArray) => [...innerArray]);
        for (let i = startCell[0]; i <= row; i++) {
          if (i > startCell[0]) {
            for (let j = 0; j < newArray[i].length; j++) {
              if (i < row || j <= col) {
                newArray[i][j] = true;
              }
            }
          } else {
            for (let j = startCell[1]; j < newArray[i].length; j++) {
              if (i < row || j <= col) {
                newArray[i][j] = true;
              }
            }
          }
        }
        setIsMouseDown(newArray);
      }
    }
  };

  const mouseUp = () => {
    if (!header) {
      setIsMouseDown(initialIsMouseDown);
      setIsCreateModalOpen(true, selectedStartDate, cellDate);
    }
  };

  return (
    <div
      id='cell'
      onClick={() => {
        if (!header) {
          setIsCreateModalOpen(true, cellDate, cellDate);
          console.log('cellDate:', cellDate, date);
        }
      }}
      onMouseDown={mouseDown}
      onMouseOver={mouseOver}
      onMouseUp={mouseUp}
      className={clsx(
        'flex select-none flex-col items-start border-b text-sm w-5',
        {
          [header
            ? 'h-10 items-center justify-center'
            : dayCounts > 35
              ? 'h-24 px-2 py-1 hover:bg-gray-200 active:bg-gray-200'
              : 'h-28 px-2 py-1 hover:bg-gray-200 active:bg-gray-200']: true,
        },
        // {
        //   [!header && isSelected ? 'bg-gray-200 cursor-grab' : '']: true,
        // },
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Cell;
