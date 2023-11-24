import { Button } from '@nextui-org/react';
import { addMonths, format, subMonths } from 'date-fns';
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
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  formateDate: string;
  setFormateDate: React.Dispatch<React.SetStateAction<string>>;
};

const Navigation: React.FC<Props> = ({
  date,
  setDate,
  formateDate,
  setFormateDate,
}) => {
  const { setIsCreateModalOpen } = useModalStore();

  const changeMonth = (actionType: string, number: number) => {
    if (actionType === 'sub') {
      const newDate = subMonths(date, number);
      setDate(newDate);
      setFormateDate(format(newDate, 'MMMM, yyyy'));
    } else {
      const newDate = addMonths(date, number);
      setDate(newDate);
      setFormateDate(format(newDate, 'MMMM, yyyy'));
    }
  };

  const { currentView, setCurrentView } = useViewStore();
  console.log(currentView);

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
            setDate(new Date());
            setFormateDate(format(new Date(), 'MMMM, yyyy'));
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
            changeMonth('sub', 12);
          }}
        >
          {'<<'}
        </Button>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('sub', 1);
          }}
        >
          {'<'}
        </Button>
        <span className={styles.title}>{formateDate}</span>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('add', 1);
          }}
        >
          {'>'}
        </Button>
        <Button
          variant='flat'
          className={styles.regularButton}
          onClick={() => {
            changeMonth('add', 12);
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
          onClick={() => {
            setDate(new Date());
            setFormateDate(format(new Date(), 'MMMM, yyyy'));
          }}
        >
          <TdesignAdd
            onClick={() => setIsCreateModalOpen(true, new Date(), new Date())}
            className='text-xl text-[#5a3a1b] hover:cursor-pointer'
          />{' '}
        </Button>
      </div>
    </div>
  );
};

export default Navigation;
