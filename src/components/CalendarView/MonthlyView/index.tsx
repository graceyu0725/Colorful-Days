import clsx from 'clsx';
import { differenceInDays, endOfMonth, startOfMonth } from 'date-fns';
import Cell from './Cell';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  value?: Date;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  formateDate: string;
  setFormateDate: React.Dispatch<React.SetStateAction<string>>;
};

const MonthlyView: React.FC<Props> = ({
  value = new Date(),
  date,
  setDate,
  formateDate,
  setFormateDate,
}) => {
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDateOfMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const lastDateOfLastMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfNextMonth = new Date(
    currentYear,
    currentMonth + 1,
    1,
  ).getDay();

  console.log(lastDateOfMonth + firstDayOfMonth + firstDayOfNextMonth);

  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  return (
    <div className='mt-2 w-full border-l border-t'>
      <div className='grid grid-cols-7 items-center justify-center text-center'>
        {weeks.map((week, index) => (
          <Cell key={index} className='text-base font-bold uppercase' header>
            {week}
          </Cell>
        ))}

        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <Cell
            key={index}
            className='bg-gray-100 text-gray-400'
            dayCounts={
              lastDateOfMonth + firstDayOfMonth + 7 - firstDayOfNextMonth
            }
          >
            {lastDateOfLastMonth - firstDayOfMonth + 1 + index}
          </Cell>
        ))}

        {Array.from({ length: lastDateOfMonth }).map((_, index) => {
          const date = index + 1;
          const isCurrentDate =
            currentMonth === new Date().getMonth() && date === value.getDate();

          return (
            <Cell
              key={date}
              dayCounts={
                lastDateOfMonth + firstDayOfMonth + 7 - firstDayOfNextMonth
              }
            >
              <div
                className={clsx('w-6', {
                  [isCurrentDate ? 'rounded-xl bg-amber-800 text-white' : '']:
                    true,
                })}
              >
                {date}
              </div>
            </Cell>
          );
        })}

        {firstDayOfNextMonth > 0 &&
          Array.from({ length: 7 - firstDayOfNextMonth }).map((_, index) => (
            <Cell
              key={index}
              className='bg-gray-100 text-gray-400'
              dayCounts={
                lastDateOfMonth + firstDayOfMonth + 7 - firstDayOfNextMonth
              }
            >
              {index + 1}
            </Cell>
          ))}
      </div>
    </div>
  );
};

export default MonthlyView;
