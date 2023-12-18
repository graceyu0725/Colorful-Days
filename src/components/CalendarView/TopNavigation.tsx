import { Button, ButtonGroup, Tooltip } from '@nextui-org/react';
import clsx from 'clsx';
import { addDays, addMonths, subDays, subMonths } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import CodiconFilter from '~icons/codicon/filter';
import LucideAlignJustify from '~icons/lucide/align-justify';
import TdesignAdd from '~icons/tdesign/add';
import { useAuthStore } from '../../store/authStore';
import { useModalStore } from '../../store/modalStore';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';

type Props = {
  value?: Date;
  setIsSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsSideNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Navigation: React.FC<Props> = ({
  setIsSideBarOpen,
  setIsSideNavigationOpen,
}) => {
  const { setIsCreateModalOpen } = useModalStore();
  const {
    currentView,
    setCurrentView,
    currentDate,
    setCurrentDate,
    formateDate,
  } = useViewStore();
  const { currentThemeColor } = useAuthStore();
  const navigate = useNavigate();

  const styles = {
    container: 'w-full h-16 flex justify-between items-center px-6 border-b',
    borderButton: clsx(
      'text-base border-1 text-slate-700 hover:bg-gray-200 hover:cursor-pointer',
      currentThemeColor.hover,
    ),
    addButton: clsx(
      'p-0 min-w-unit-10 text-base border-1 text-slate-700 hover:bg-gray-200 hover:cursor-pointer rounded-md',
      currentThemeColor.hover,
    ),
    wrapper: 'flex items-center',
    title: 'font-bold mx-2 text-xl w-44 text-center',
    viewButton: clsx(
      'h-8 text-base border-0 bg-white text-slate-700 hover:text-slate-500 hover:cursor-pointer rounded-md',
      currentThemeColor.hover,
    ),
    activeButton: clsx(
      'h-8 text-base border-0 bg-white bg-slate-500 text-white hover:cursor-pointer rounded-md',
      currentThemeColor.darkBackground,
    ),
    changeButton: clsx(
      'border-1 border-r-0 min-w-0 w-8 p-0',
      currentThemeColor.hover,
    ),
  };

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
        <LucideAlignJustify
          className='mr-4 text-xl text-slate-700 hover:cursor-pointer'
          onClick={() => setIsSideNavigationOpen((prev) => !prev)}
        />

        <div className='flex items-center justify-center'>
          <div className='items-end hidden md:flex'>
            <img
              src='/assets/logo.png'
              className='hover:cursor-pointer w-9 ml-6 mr-2 lg:mr-0'
              onClick={() => navigate('/calendar')}
            />
            <h1
              className='hover:cursor-pointer font-custom font-bold px-1 text-2xl mr-4 text-theme-1-300 hidden lg:block'
              onClick={() => navigate('/calendar')}
            >
              Colorful Days
            </h1>
          </div>

          <Button
            variant='bordered'
            className={clsx('hidden md:block', styles.borderButton)}
            onClick={() => {
              setCurrentDate(new Date());
            }}
          >
            Today
          </Button>

          <ButtonGroup className='min-w-0 ml-6 md:ml-2' variant='bordered'>
            <Button
              className={styles.changeButton}
              onClick={() => {
                changeMonth('sub');
              }}
            >
              {'<'}
            </Button>
            <Button
              className={clsx(styles.changeButton, 'border-r-1')}
              onClick={() => {
                changeMonth('add');
              }}
            >
              {'>'}
            </Button>
          </ButtonGroup>

          <span className={styles.title}>{formateDate}</span>
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <div className='border rounded-md p-1 gap-1 hidden sm:flex'>
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
        </div>

        <Tooltip showArrow={true} placement='bottom' content='Create an event'>
          <Button
            variant='bordered'
            className={styles.addButton}
            onClick={() =>
              setIsCreateModalOpen(true, new Date(), new Date(), false)
            }
          >
            <TdesignAdd className='text-xl text-slate-700 hover:cursor-pointer' />
          </Button>
        </Tooltip>

        <Tooltip showArrow={true} placement='bottom' content='Filter'>
          <Button
            variant='bordered'
            className={styles.addButton}
            onClick={() => setIsSideBarOpen((prev) => !prev)}
          >
            <CodiconFilter className='text-xl text-slate-700 hover:cursor-pointer' />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Navigation;
