import { renderEvent } from '../../../utils/handleDatesAndEvents';
import { Event } from '../../../utils/types';

type Props = {
  splitEvents: Event[][][];
  weekIndex: number;
  week: Date[];
};

const EventCells: React.FC<Props> = ({ splitEvents, weekIndex, week }) => {
  function adjustEvents(origin: Event[][]) {
    let firstAppearanceIndexes: { [eventId: string]: number } = {};
    let expectation = [];

    for (let i = 0; i < origin.length; i++) {
      let currentDay = origin[i];
      // let newDay = [{
      //   eventId: 0,
      //   title: 'Empty event',
      //   startAt: new Date(),
      //   endAt: new Date(),
      //   isAllDay: false,
      //   isMemo: true,
      //   tag: '0',
      //   note: '',
      //   createdAt: null,
      //   updatedAt: null,
      //   messages: [],
      // }];

      let newDay = [];

      currentDay.forEach((eventArray, idx) => {
        let event = eventArray.eventId;

        if (i === 0 || !(event in firstAppearanceIndexes)) {
          firstAppearanceIndexes[event] = idx;
          newDay[idx] = eventArray;
        } else {
          let firstIdx = firstAppearanceIndexes[event];
          newDay[firstIdx] = eventArray;
        }
      });

      // Ｑ：有事件重疊會被覆蓋掉
      while (
        newDay.length < (i > 0 ? origin[i - 1].length : currentDay.length)
      ) {
        newDay.push([]);
      }

      // console.log("newDay:",newDay)
      if (newDay.length > 0 && newDay[newDay.length - 1].length === 0) {
        expectation.push(newDay.slice(0, -1));
      } else if (!(newDay.length === 1 && newDay[0].length === 0)) {
        expectation.push(newDay);
      } else {
        expectation.push([]);
      }
    }

    // console.log('expectation:', expectation);
    return expectation;
  }

  // let origin = [
  //   [['Event1']],
  //   [['Event1'], ['Event2'], ['Event3']],
  //   [['Event2'], ['Event3']],
  //   [['Event3']],
  // ];
  // console.log('adjust', adjustEvents(splitEvents[1]));

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
      id='eventCellsWrapper'
    >
      {children}
    </div>
  );

  const EventRow: React.FC<WrapperProps> = ({ children }) => (
    <div className='grid gap-px grid-cols-7' id='eventRow'>
      {children}
    </div>
  );

  return (
    <EventCellsWrapper id='eventCellsWrapper'>
      <EventRow id='eventRow'>
        {adjustEvents(splitEvents[weekIndex]).map((events, index) =>
          events[0] ? (
            renderEvent(events[0], week[index])
          ) : (
            <div key={index} className=''></div>
          ),
        )}
      </EventRow>
      <EventRow id='eventRow'>
        {adjustEvents(splitEvents[weekIndex]).map((events, index) =>
          events[1] ? (
            renderEvent(events[1], week[index])
          ) : (
            <div className=''></div>
          ),
        )}
      </EventRow>
    </EventCellsWrapper>
  );
};

export default EventCells;
