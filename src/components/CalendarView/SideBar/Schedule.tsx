import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import TablerCalendarMinus from '~icons/tabler/calendar-minus';
import { useModalStore } from '../../../store/modalStore';
import { themeColors } from '../../../utils/theme';
import { Event } from '../../../utils/types';
import { useAuthStore } from '../../../store/authStore';

type Props = {
  todaysEvents: Event[];
};

const Schedule: React.FC<Props> = ({ todaysEvents }) => {
  const { setIsEditModalOpen } = useModalStore();
  const { currentThemeColor } = useAuthStore();

  const handleClick = (event: Event) => {
    setIsEditModalOpen(true, event);
  };

  return (
    <div className='mt-2 mb-1 max-h-80'>
      <Card
        className={clsx(
          'w-full h-full shadow border-2',
          currentThemeColor.lightBorder,
        )}
      >
        <CardHeader>Today's Events</CardHeader>
        <Divider />
        <CardBody className='overscroll-x-none flex flex-col gap-1'>
          {todaysEvents.length > 0 ? (
            todaysEvents.map((event, index) =>
              event.isAllDay ? (
                <div
                  key={index}
                  className={clsx(
                    'truncate rounded indent-1.5 hover:cursor-pointer text-white hover:-translate-y-px hover:shadow-md',
                    themeColors[Number(event.tag)].darkBackground,
                  )}
                  onClick={() => handleClick(event)}
                >
                  {event.title}
                </div>
              ) : (
                <div
                  key={index}
                  className={clsx(
                    'flex items-center justify-between truncate rounded indent-1.5 hover:cursor-pointer hover:-translate-y-px hover:shadow-md',
                    themeColors[Number(event.tag)].lightBackground,
                  )}
                  onClick={() => handleClick(event)}
                >
                  <div className='truncate'>{event.title}</div>
                  <div className='truncate mr-1 text-xs text-slate-500 mt-1'>
                    {format(event.startAt || new Date(), 'h:mm a')}
                  </div>
                </div>
              ),
            )
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <TablerCalendarMinus className='text-2xl mb-1 text-slate-400' />
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
