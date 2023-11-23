import { Button } from '@nextui-org/react';
import { addMonths, format, subMonths } from 'date-fns';

const styles = {
  container: 'w-full h-16 flex justify-between items-center',
  borderButton: 'text-base border-1 hover:bg-gray-200 hover:cursor-pointer',
  regularButton:
    'text-base p-2 min-w-0 w-8 h-8 rounded-full bg-white hover:bg-gray-200 hover:cursor-pointer',
  wrapper: 'flex items-center',
  title: 'font-bold mx-2 text-xl w-44 text-center',
  viewButton:
    'text-base border-0 bg-white hover:bg-gray-200 hover:cursor-pointer',
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

  return (
    <div className={styles.container}>
      <div>
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
      <div>
        <Button className={styles.viewButton}>Monthly </Button>｜
        <Button className={styles.viewButton}>Weekly</Button>｜
        <Button className={styles.viewButton}>List</Button>
      </div>
    </div>
  );
};

export default Navigation;
