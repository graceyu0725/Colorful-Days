import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import TablerPointFilled from '~icons/tabler/point-filled';
import { useModalStore } from '../../../store/modalStore';
import { Event } from '../../../utils/types';
import TablerCalendarMinus from '~icons/tabler/calendar-minus'

type Props = {
  todaysEvents: Event[];
};

const Schedule: React.FC<Props> = ({ todaysEvents }) => {
  const { setIsEditModalOpen } = useModalStore();
  const handleClick = (event: Event) => {
    setIsEditModalOpen(true, event);
  };

  return (
    <div className='mt-2 mb-1 max-h-80'>
      <Card className='w-full h-full shadow border'>
        <CardHeader>Today's Events</CardHeader>
        <Divider/>
        <CardBody className='overscroll-x-none'>
          {todaysEvents.length > 0? (
todaysEvents.map((event, index) => (
  <div
    key={index}
    className='flex items-center text-base hover:cursor-pointer'
    onClick={() => handleClick(event)}
  >
    <TablerPointFilled className='text-sm flex-shrink-0' />
    <p className='truncate hover:underline shrink'>{event.title}</p>
  </div>
))
          ):(
            <div className='flex flex-col items-center justify-center'>
              <TablerCalendarMinus className='text-2xl mb-1 text-slate-400'/>
              <div className='text-slate-400'>No events.</div>
              <div className='text-slate-400'>Enjoy your Day!</div>
            </div>
          )}
          
        </CardBody>
      </Card>
    </div>
  );
};

export default Schedule;
