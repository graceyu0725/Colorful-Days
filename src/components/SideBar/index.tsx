import { getAllEvents, useEventsStore } from '../../store/eventsStore';
import { useModalStore } from '../../store/modalStore';
import { Event } from '../../utils/type';

function SideBar() {
  const { setIsEditModalOpen } = useModalStore();
  const { allEvents } = useEventsStore();
  getAllEvents();

  const handleClick = (event: Event) => {
    setIsEditModalOpen(true, event);
  };

  return (
    <>
      <div className='border-r-3 fixed h-screen w-64 border-slate-300 p-4'>
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
