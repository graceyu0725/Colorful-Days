import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { isSameWeek } from 'date-fns';
import IcBaselineDragIndicator from '~icons/ic/baseline-drag-indicator';
import { CalendarViewCategory, useViewStore } from '../../store/viewStore';
import { themeColors } from '../../utils/theme';
import { Event } from '../../utils/types';

type Props = {
  id: string;
  children: React.ReactNode;
  className: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  event: Event;
  isOverlay?: boolean;
};

const DraggableItem: React.FC<Props> = ({
  id,
  children,
  className,
  style,
  onClick,
  event,
  isOverlay,
}) => {
  const { currentView } = useViewStore();
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id: id,
      data: event,
    });

  const areDatesSameWeek = isSameWeek(
    event.endAt || new Date(),
    event.startAt || new Date(),
  );

  return (
    <>
      {isOverlay ? (
        <div
          id={id}
          className={clsx(
            'flex z-50',
            className,
            event.isMemo
              ? 'h-12 rounded-lg p-3 items-center'
              : currentView === CalendarViewCategory.Monthly
                ? 'h-6 items-center'
                : event.isAllDay
                  ? 'h-5 text-sm text-white items-center'
                  : `text-sm items-start h-full rounded-none border-l-2 pl-1 ${
                      themeColors[Number(event.tag)].border
                    }`,
          )}
        >
          <IcBaselineDragIndicator className='drag-handler h-5 shrink-0 outline-none' />
          <div className='truncate grow h-full ml-0'>{children}</div>
        </div>
      ) : (
        <div
          id={id}
          ref={setNodeRef}
          onClick={onClick}
          className={clsx(
            'flex z-50',
            className,
            event.isMemo
              ? 'h-12 rounded-lg p-3 items-center'
              : currentView === CalendarViewCategory.Monthly
                ? 'h-6 items-center'
                : event.isAllDay
                  ? 'h-5 text-sm items-center'
                  : 'text-sm items-start',
          )}
          style={{
            ...style,
            opacity: isDragging && areDatesSameWeek ? 0.5 : 1,
            transform: !areDatesSameWeek
              ? CSS.Translate.toString(transform)
              : '',
          }}
        >
          <IcBaselineDragIndicator
            className='drag-handler h-5 shrink-0 outline-none'
            {...attributes}
            {...listeners}
          />
          <div className='truncate grow h-full'>{children}</div>
        </div>
      )}
    </>
  );
};

export { DraggableItem };
