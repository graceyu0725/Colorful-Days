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

      return (
        isWithinInterval(startOfToday(), {
          start: startDate,
          end: endDate,
        }) && !event.isMemo
      );
    }
  });

  const calendarTags = currentCalendarContent.tags || defaultTags;

  return (
    <>
      <div
        className={clsx(
          'w-0 overflow-y-scroll border-slate-300 transition-all flex flex-col',
          {
            'w-60 border-l px-3 py-4': isSideBarOpen,
          },
        )}
      >
        <TagFilter calendarTags={calendarTags} />
        <Schedule todaysEvents={todaysEvents} />
      </div>
    </>
  );
};

export default SideBar;
