import { Button } from '@nextui-org/react';
import { addDays, addMonths, subDays, subMonths } from 'date-fns';
import LucideAlignJustify from '~icons/lucide/align-justify';
import TdesignAdd from '~icons/tdesign/add';
import { useModalStore } from '../../store/modalStore';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';

const styles = {
  container: 'w-full h-16 flex justify-between items-center px-6 border-b',
  borderButton: 'text-base border-1 hover:bg-gray-200 hover:cursor-pointer',
  addButton:
    'p-1 min-w-unit-10 text-base border-1 hover:bg-gray-200 hover:cursor-pointer rounded-md',
  regularButton:
    'text-base p-2 min-w-0 w-8 h-8 rounded-full bg-white hover:bg-gray-200 hover:cursor-pointer',
  wrapper: 'flex items-center',
  title: 'font-bold mx-2 text-xl w-44 text-center',
  viewButton:
    'h-8 text-base border-0 bg-white hover:text-slate-500 hover:cursor-pointer rounded-md',
  activeButton:
    'h-8 text-base border-0 bg-white bg-slate-500 text-white hover:cursor-pointer rounded-md',
};

type Props = {
  value?: Date;
};

const Navigation: React.FC<Props> = () => {
  const { setIsCreateModalOpen } = useModalStore();
  const {
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    formateDate,
  } = useViewStore();

  const changeMonth = (actionType: string) => {
    switch (actionType) {
      case 'subMore':
        currentView === CalendarViewCategory.Monthly
          ? setCurrentDate(subMonths(currentDate, 12))
          : setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'sub':
        currentView === CalendarViewCategory.Monthly
          ? setCurrentDate(subMonths(currentDate, 1))
          : setCurrentDate(subDays(currentDate, 7));
        break;
      case 'addMore':
        currentView === CalendarViewCategory.Monthly
          ? setCurrentDate(addMonths(currentDate, 12))
          : setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'add':
        currentView === CalendarViewCategory.Monthly
          ? setCurrentDate(addMonths(currentDate, 1))
          : setCurrentDate(addDays(currentDate, 7));
        break;
    }
  };

  return (
    <div className={styles.container}>
      <div className='flex items-center'>
        <LucideAlignJustify className='mr-4 text-xl text-[#5a3a1b] hover:cursor-pointer' />
        <img src='/assets/logo.png' className='w-10' />
        <h1 className='px-1 text-lg font-bold text-[#5a3a1b] mr-4'>
          Colorful Days
        </h1>

        <Button
          variant='bordered'
          className={styles.borderButton}
          onClick={() => {
            setCurrentDate(new Date());
          }}
        >
          Today
        </Button>
      </div>
      <div className={styles.wrapper}>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('subMore');
          }}
        >
          {'<<'}
        </Button>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('sub');
          }}
        >
          {'<'}
        </Button>
        <span className={styles.title}>{formateDate}</span>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('add');
          }}
        >
          {'>'}
        </Button>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('addMore');
          }}
        >
          {'>>'}
        </Button>
      </div>

      <div className='flex items-center gap-1'>
        <div className='border rounded-md p-1 flex gap-1'>
          <Button
            className={
              currentView === CalendarViewCategory.Monthly
                ? styles.activeButton
                : styles.viewButton
            }
            onClick={() => setCurrentView(CalendarViewCategory.Monthly)}
          >
            Monthly
          </Button>
          <Button
            className={
              currentView === CalendarViewCategory.Weekly
                ? styles.activeButton
                : styles.viewButton
            }
            onClick={() => setCurrentView(CalendarViewCategory.Weekly)}
          >
            Weekly
          </Button>
          {/* <Button className={styles.viewButton}>List</Button> */}
        </div>
        <Button
          variant='bordered'
          className={styles.addButton}
          onClick={() =>
            setIsCreateModalOpen(true, new Date(), new Date(), false)
          }
        >
          <TdesignAdd className='text-xl text-[#5a3a1b] hover:cursor-pointer' />{' '}
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
