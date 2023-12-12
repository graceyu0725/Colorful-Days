import AdventCalendar from './AdventCalendar';
import Content from './Content';
import Header from './Header';

export default function Home() {
  return (
    <div className='flex justify-center bg-theme-1-50'>
      <Header />
      <div className='flex w-full 2xl:w-11/12'>
        <Content />
        <AdventCalendar />
      </div>
    </div>
  );
}
