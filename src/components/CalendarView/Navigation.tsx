import { Button, ButtonGroup } from '@nextui-org/react';

const styles = {
  container: 'w-full h-16 flex justify-between items-center',
  borderButton: 'text-base border-1 hover:bg-gray-200 hover:cursor-pointer',
  regularButton:
    'text-base p-2 min-w-0 w-8 h-8 rounded-2xl bg-white hover:bg-gray-200 hover:cursor-pointer',

  wrapper: 'flex items-center',
  title: 'font-bold mx-2 text-xl',
  viewButton:
    'text-base border-0 bg-white hover:bg-gray-200 hover:cursor-pointer',
};

function Navigation() {
  return (
    <div className={styles.container}>
      <div>
        <Button variant='bordered' className={styles.borderButton}>
          Today{' '}
        </Button>
      </div>
      <div className={styles.wrapper}>
        <Button variant='flat' className={styles.regularButton}>
          {'<<'}
        </Button>
        <Button variant='flat' className={styles.regularButton}>
          {'<'}
        </Button>
        <span className={styles.title}>November, 2023</span>
        <Button variant='flat' className={styles.regularButton}>
          {'>'}
        </Button>
        <Button variant='flat' className={styles.regularButton}>
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
}

export default Navigation;
