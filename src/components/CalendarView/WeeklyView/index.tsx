import clsx from 'clsx';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const commonTimeStyles = 'row-span-2 col-start-1 relative -top-3 pl-4 text-slate-500';
const timeStyles = [
  { time: '', style: clsx('row-start-1', commonTimeStyles) },
  { time: '1 AM', style: clsx('row-start-3', commonTimeStyles) },
  { time: '2 AM', style: clsx('row-start-5', commonTimeStyles) },
  { time: '3 AM', style: clsx('row-start-7', commonTimeStyles) },
  { time: '4 AM', style: clsx('row-start-9', commonTimeStyles) },
  { time: '5 AM', style: clsx('row-start-11', commonTimeStyles) },
  { time: '6 AM', style: clsx('row-start-13', commonTimeStyles) },
  { time: '7 AM', style: clsx('row-start-15', commonTimeStyles) },
  { time: '8 AM', style: clsx('row-start-17', commonTimeStyles) },
  { time: '9 AM', style: clsx('row-start-19', commonTimeStyles) },
  { time: '10 AM', style: clsx('row-start-21', commonTimeStyles) },
  { time: '11 AM', style: clsx('row-start-23', commonTimeStyles) },
  { time: '12 PM', style: clsx('row-start-25', commonTimeStyles) },
  { time: '1 PM', style: clsx('row-start-27', commonTimeStyles) },
  { time: '2 PM', style: clsx('row-start-29', commonTimeStyles) },
  { time: '3 PM', style: clsx('row-start-31', commonTimeStyles) },
  { time: '4 PM', style: clsx('row-start-33', commonTimeStyles) },
  { time: '5 PM', style: clsx('row-start-35', commonTimeStyles) },
  { time: '6 PM', style: clsx('row-start-37', commonTimeStyles) },
  { time: '7 PM', style: clsx('row-start-39', commonTimeStyles) },
  { time: '8 PM', style: clsx('row-start-41', commonTimeStyles) },
  { time: '9 PM', style: clsx('row-start-43', commonTimeStyles) },
  { time: '10 PM', style: clsx('row-start-45', commonTimeStyles) },
  {
    time: '11 PM',
    style: clsx('row-start-47 border-b -mb-3', commonTimeStyles),
  },
];
type Props = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  formateDate: string;
  setFormateDate: React.Dispatch<React.SetStateAction<string>>;
};

const WeeklyView: React.FC<Props> = ({ date }) => {
  return (
    <div id='weekly-view-root' className='flex flex-col border-x border-t'>
      <div
        id='weekly-view-header'
        className='w-full h-36 bg-gray-50 grid grid-rows-weeklyHeader grid-cols-weeklyHeader'
      >
        <div className='col-start-1'></div>
        <div className='col-start-2 pl-1 text-sm font-bold'>Sun</div>
        <div className='col-start-3 pl-1 text-sm font-bold'>Mon</div>
        <div className='col-start-4 pl-1 text-sm font-bold'>Tue</div>
        <div className='col-start-5 pl-1 text-sm font-bold'>Wed</div>
        <div className='col-start-6 pl-1 text-sm font-bold'>Thu</div>
        <div className='col-start-7 pl-1 text-sm font-bold'>Fri</div>
        <div className='col-start-8 pl-1 text-sm font-bold'>Sat</div>

        <div className='col-start-2 row-start-2 row-span-2 border-r border-t pl-2'>
          19
        </div>
        <div className='col-start-3 row-start-2 row-span-2 border-r border-t pl-2'>
          20
        </div>
        <div className='col-start-4 row-start-2 row-span-2 border-r border-t pl-2'>
          21
        </div>
        <div className='col-start-5 row-start-2 row-span-2 border-r border-t pl-2'>
          22
        </div>
        <div className='col-start-6 row-start-2 row-span-2 border-r border-t pl-2'>
          23
        </div>
        <div className='col-start-7 row-start-2 row-span-2 border-r border-t pl-2'>
          24
        </div>
        <div className='col-start-8 row-start-2 row-span-2 border-t pl-2'>
          24
        </div>

        <div className='col-start-1 row-start-3 border-b pl-4 text-sm'>All-day</div>
        {/* 這裡用來放整日的時間  */}
        <div className='col-start-2 row-start-3 border-b col-span-7 grid grid-cols-7 text-sm'>
          <div>Event rowwww Events</div>
        </div>
      </div>

      {/* 一個大 Grid 包含左邊時間列及中間 Time table，Time table 也需要一個 Grid */}
      <div
        id='weekly-view-time-table'
        className='relative w-full grid grid-cols-weeklyTimeTable grid-rows-weeklyTimeTable overflow-auto'
      >
        {/* 左邊時間列 */}
        {timeStyles.map((timeStyle, index) => (
          <time key={index} className={timeStyle.style}>
            {timeStyle.time}
          </time>
        ))}

        {weekdays.map((weekday, index) => (
          <div
            key={index}
            id={`column-${weekday}`}
            className='border-l column-start-2 row-start-1 row-span-full column-span-1 grid grid-rows-weeklyTimeTable z-10'
          >
            {timeStyles.map((timeStyle, index) => (
              <>
                <div
                  key={`row-1-${index}`}
                  className='border-b border-dashed hover:bg-slate-50'
                ></div>
                <div key={`row-2-${index}`} className='border-b hover:bg-slate-50'></div>
              </>
            ))}
          </div>
        ))}
        {/* Time Table Grid - 7 columns */}
      </div>
    </div>
  );
};

export default WeeklyView;
