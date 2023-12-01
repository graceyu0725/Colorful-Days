import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import TablerPointFilled from '~icons/tabler/point-filled';
import { useModalStore } from '../../../store/modalStore';
import { Event } from '../../../utils/types';

type Props = {
  todaysEvents: Event[];
};

const Schedule: React.FC<Props> = ({ todaysEvents }) => {
  const { setIsEditModalOpen } = useModalStore();
  const handleClick = (event: Event) => {
    setIsEditModalOpen(true, event);
  };

  return (
    <div className='h-1/2 px-2 mt-4 mb-1'>
      <Card className='w-full h-full rounded-lg shadow border'>
        <CardHeader>Today's Events</CardHeader>
        <Divider></Divider>
        <CardBody className='overscroll-x-none'>
          {todaysEvents.map((event, index) => (
            <div
              key={index}
              className='flex items-center text-base hover:cursor-pointer'
              onClick={() => handleClick(event)}
            >
              <TablerPointFilled className='text-sm flex-shrink-0' />
              <p className='truncate hover:underline shrink'>{event.title}</p>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
};

export default Schedule;
