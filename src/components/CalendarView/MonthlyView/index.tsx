import clsx from 'clsx';
import { differenceInDays, endOfMonth, startOfMonth } from 'date-fns';
import Cell from './Cell';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  value?: Date;
};

const Calendar: React.FC<Props> = ({ value = new Date() }) => {
  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  return (
    <div className='mt-1 w-full border-l border-t'>
      <div className='grid grid-cols-7 items-center justify-center text-center'>
        {weeks.map((week, index) => (
          <Cell key={index} className='text-base font-bold uppercase' header>
            {week}
          </Cell>
        ))}

        {Array.from({ length: prefixDays }).map((_, index) => (
          <Cell key={index} />
        ))}

        {Array.from({ length: numDays }).map((_, index) => {
          const date = index + 1;
          const isCurrentDate = date === value.getDate();

          return (
            <Cell key={date}>
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

        {Array.from({ length: suffixDays }).map((_, index) => (
          <Cell key={index} />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
