import clsx from 'clsx';
import { endOfDay, isWithinInterval, startOfDay, startOfToday } from 'date-fns';
import { useAuthStore } from '../../../store/authStore';
import { useEventsStore } from '../../../store/eventsStore';
import { defaultTags } from '../../../utils/types';
import Schedule from './Schedule';
import TagFilter from './TagFilter';

type Props = {
  isSideBarOpen: boolean;
};

const SideBar: React.FC<Props> = ({ isSideBarOpen }) => {
  const { allEvents } = useEventsStore();
  const { currentCalendarContent } = useAuthStore();

  const todaysEvents = allEvents.filter((event) => {
    if (event.startAt && event.endAt) {
      const startDate = startOfDay(event.startAt);
      const endDate = endOfDay(event.endAt);

      return isWithinInterval(startOfToday(), {
        start: startDate,
        end: endDate,
      });
    }
  });

  const calendarTags = currentCalendarContent.tags || defaultTags;

  return (
    <>
      <div
        className={clsx(
          'border-r w-0 overflow-hidden border-slate-300 transition-all flex flex-col',
          {
            'w-56': isSideBarOpen,
          },
        )}
      >
        <Schedule todaysEvents={todaysEvents} />
        <TagFilter calendarTags={calendarTags} />
      </div>
    </>
  );
};

export default SideBar;
