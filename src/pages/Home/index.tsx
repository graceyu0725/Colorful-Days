import AdventCalendar from './AdventCalendar';
import Content from './Content';
import Header from './Header';

export default function Home() {
  return (
    <div className='flex justify-center bg-theme-1-50'>
      <Header />
      <div className='flex w-full'>
        <Content />
        <AdventCalendar />
      </div>
    </div>
  );
}
