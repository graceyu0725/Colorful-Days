import { getAllEvents, useEventsStore } from '../../store/eventsStore';
import { useModalStore } from '../../store/modalStore';
import { Event } from '../../utils/types';

function SideBar() {
  const { setIsEditModalOpen } = useModalStore();
  const { allEvents } = useEventsStore();
  getAllEvents();

  const handleClick = (event: Event) => {
    setIsEditModalOpen(true, event);
  };

  return (
    <>
      <div
        className='border-r w-64 border-slate-300 p-4'
        // style={{ height: 'calc(100vh - 56px)' }}
      >
        Events (old to new)
        <div className='flex flex-col w-fit	gap-1'>
          {allEvents.map((event) => (
            <div
              key={event.eventId}
              className='underline underline-offset-4 cursor-pointer'
              onClick={() => handleClick(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SideBar;
