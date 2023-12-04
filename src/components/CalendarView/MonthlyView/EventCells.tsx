import { getDay } from 'date-fns';
import { useModalStore } from '../../../store/modalStore';
import { renderEvent } from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/types';

type Props = {
  splitEvents: Event[][][];
  weekIndex: number;
  week: Date[];
};

const EventCells: React.FC<Props> = ({ splitEvents, weekIndex, week }) => {
  const { isMoreModalOpen, setIsMoreModalOpen, eventsToShow } = useModalStore();

  // function adjustEvents(origin: Event[][]) {
  //   let firstAppearanceIndexes: { [eventId: string]: number } = {};
  //   let expectation = [];

  //   for (let i = 0; i < origin.length; i++) {
  //     let currentDay = origin[i];
  //     // let newDay = [{
  //     //   eventId: 0,
  //     //   title: 'Empty event',
  //     //   startAt: new Date(),
  //     //   endAt: new Date(),
  //     //   isAllDay: false,
  //     //   isMemo: true,
  //     //   tag: '0',
  //     //   note: '',
  //     //   createdAt: null,
  //     //   updatedAt: null,
  //     //   messages: [],
  //     // }];

  //     let newDay = [];

  //     currentDay.forEach((eventArray, idx) => {
  //       let event = eventArray.eventId;

  //       if (i === 0 || !(event in firstAppearanceIndexes)) {
  //         firstAppearanceIndexes[event] = idx;
  //         newDay[idx] = eventArray;
  //       } else {
  //         let firstIdx = firstAppearanceIndexes[event];
  //         newDay[firstIdx] = eventArray;
  //       }
  //     });

  //     // Ｑ：有事件重疊會被覆蓋掉
  //     while (
  //       newDay.length < (i > 0 ? origin[i - 1].length : currentDay.length)
  //     ) {
  //       newDay.push([]);
  //     }

  //     // console.log("newDay:",newDay)
  //     if (newDay.length > 0 && newDay[newDay.length - 1].length === 0) {
  //       expectation.push(newDay.slice(0, -1));
  //     } else if (!(newDay.length === 1 && newDay[0].length === 0)) {
  //       expectation.push(newDay);
  //     } else {
  //       expectation.push([]);
  //     }
  //   }

  //   return expectation;
  // }

  // ================================================================
  // Handle rendering
  // ================================================================
  interface WrapperProps {
    children: React.ReactNode;
    id: string;
  }

  const EventCellsWrapper: React.FC<WrapperProps> = ({ children }) => (
    <div
      className='absolute flex flex-col w-full top-7 gap-y-1'
      style={{ pointerEvents: 'none' }}
      id='eventCellsWrapper'
    >
      {children}
    </div>
  );

  const EventRow: React.FC<WrapperProps> = ({ children }) => (
    <div className='grid gap-px grid-cols-7 auto-rows-auto' id='eventRow'>
      {children}
    </div>
  );

  return (
    <EventCellsWrapper id='eventCellsWrapper'>
      <EventRow id='eventRow'>
        {splitEvents[weekIndex].map((events, eventsIndex) =>
          events.map((event, eventIndex) =>
            eventIndex < 2 ? (
              event ? (
                renderEvent(event, week[eventsIndex], eventIndex)
              ) : null
            ) : eventIndex === 2 && !event.isMemo ? (
              <div
                className='truncate border-2 border-slate-200 text-xs text-center w-10 rounded hover:cursor-pointer'
                style={{
                  gridColumnStart: getDay(week[eventsIndex]) + 1,
                  pointerEvents: 'auto',
                }}
                onClick={() => setIsMoreModalOpen(true, events)}
              >
                more
              </div>
            ) : null,
          ),
        )}
      </EventRow>
    </EventCellsWrapper>
  );
};

export default EventCells;
