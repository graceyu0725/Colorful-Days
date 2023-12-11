import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useState } from 'react';
import BxBxsQuoteAltLeft from '~icons/bx/bxs-quote-alt-left';
import BxBxsQuoteAltRight from '~icons/bx/bxs-quote-alt-right';
import MajesticonsHandPointer2Line from '~icons/majesticons/hand-pointer-2-line';
import backgroundImage from './background.png';

export default function AdventCalendar() {
  const createSpecialArray = () => {
    const result = [];
    let start = 1;
    let itemsInRow = 1;

    while (start <= 25) {
      let row = [];
      for (let i = 0; i < itemsInRow && start <= 25; i++) {
        row.push(start++);
      }
      result.push(row);
      itemsInRow = itemsInRow === 6 ? 2 : itemsInRow + 1;
    }

    return result;
  };

  const datesArray = createSpecialArray();
  const specialDates = [1, 7, 14, 18, 25];
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGuided, setIsGuided] = useState(false);

  const [selectedCell, setSelectedCell] = useState<null | number>(null);

  const handleClickCell = (e: React.MouseEvent, date: number) => {
    e.stopPropagation(); // 阻止事件冒泡
    setSelectedCell(date);
  };

  return (
    <div
      id='adventCalendar'
      className='w-1/2 h-[calc(100vh_-_64px)] mt-16 flex relative overflow-hidden'
    >
      <motion.div
        className={clsx('relative w-full flex justify-center items-center')}
        whileHover={{ rotateY: isFlipped ? 0 : 20 }}
        style={{ backfaceVisibility: 'hidden' }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 30,
          duration: 500,
        }}
        onClick={() => {
          setIsFlipped(!isFlipped);
          if (!isGuided) setIsGuided(true);
        }}
      >
        {!isGuided && (
          <MajesticonsHandPointer2Line className='absolute right-28 bottom-20 -rotate-12 text-5xl text-white z-10 animate-pulse animate-infinite' />
        )}

        <motion.div
          className='min-h-content absolute top-10 bottom-10 right-20 shadow-xl flex flex-col justify-center gap-4 px-10 rounded-3xl bg-theme-1-300 hover:cursor-pointer'
          style={{ backfaceVisibility: 'hidden', perspective: '5000px' }}
          transition={{ duration: 1 }}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          <BxBxsQuoteAltLeft className='text-2xl text-white' />
          <p className='text-2xl font-bold italic text-white'>
            Colorful Days - where every day is a {''}
            <span className='underline underline-offset-8 text-white decoration-orange-300 decoration-4'>
              vivid journey
            </span>
            .
          </p>
          <BxBxsQuoteAltRight className='text-2xl text-white self-end mt-2' />
        </motion.div>

        <motion.div
          className='min-h-content absolute top-10 bottom-10 shadow-xl flex flex-col justify-center gap-4 px-10 rounded-3xl bg-theme-1-300 hover:cursor-pointer overflow-hidden'
          style={{ backfaceVisibility: 'hidden', perspective: '5000px' }}
          transition={{ duration: 1 }}
          initial={false}
          animate={{ rotateY: isFlipped ? 0 : -180 }}
        >
          <div className='flex flex-col gap-2 w-full'>
            {datesArray.map((dates, index) => (
              <div key={index} className='w-full flex justify-center gap-2'>
                {dates.map((date, idx) => (
                  <div
                    key={`date-${idx}`}
                    className={clsx(
                      'relative shadow-lg w-20 h-16 rounded-lg hover:cursor-pointer',
                      {
                        'hover:scale-110 transition':
                          specialDates.includes(date),
                      },
                      {
                        'animate-rotate-y animate-once': selectedCell === date,
                      },
                    )}
                    style={{
                      backgroundImage: `url(${backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }}
                    onClick={(e) => handleClickCell(e, date)}
                  >
                    <div
                      className={clsx(
                        'absolute left-2 top-1 font-custom rounded',
                        { 'text-amber-500': specialDates.includes(date) },
                        { 'text-theme-1-400': !specialDates.includes(date) },
                      )}
                    >
                      {date}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
