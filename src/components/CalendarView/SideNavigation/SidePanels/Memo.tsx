import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import MaterialSymbolsNoteStackAddRounded from '~icons/material-symbols/note-stack-add-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import MdiTag from '~icons/mdi/tag';
import { useAuthStore } from '../../../../store/authStore';
import { useModalStore } from '../../../../store/modalStore';
import { addNewMemo } from '../../../../utils/handleUserAndCalendar';
import { themeColors } from '../../../../utils/theme';
import { CalendarContent, Event } from '../../../../utils/types';
import { DraggableItem } from '../../../DND';

type Props = {
  memoEvents: Event[];
  currentCalendarContent: CalendarContent;
};

interface MemoContent {
  tag: string;
  title: string;
}

enum CardType {
  Add = 'Add Memo',
  List = 'Memo List',
}

const Memo: React.FC<Props> = ({ memoEvents, currentCalendarContent }) => {
  const { setIsEditModalOpen } = useModalStore();
  const { currentThemeColor } = useAuthStore();
  const [memoContent, setMemoContent] = useState({ tag: '0', title: '' });
  const [isComposing, setIsComposing] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMemo = async (
    memoContent: MemoContent,
    isComposing?: boolean,
    e?: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (isComposing) return;
    if (e && e.key !== 'Enter') return;
    if (
      !memoContent.title ||
      memoContent.title.replace(/\s+/g, '').length === 0
    ) {
      toast.error('Memo title can not be empty!');
      return;
    }

    await addNewMemo(
      memoContent.tag,
      memoContent.title.trim(),
      currentCalendarContent.calendarId,
      setIsSubmitting,
    );
    setMemoContent({ tag: '0', title: '' });
    toast.success('Memo added successfully');
  };

  const renderCardBody = (type: CardType) => {
    if (type === CardType.Add) {
      return (
        <>
          <div className='w-full flex items-center mb-2 justify-between'>
            <Popover
              placement='bottom-start'
              isOpen={isPopoverOpen}
              onOpenChange={(open) => setIsPopoverOpen(open)}
            >
              <PopoverTrigger className='hover:cursor-pointer'>
                <div>
                  <MdiTag
                    className={clsx(
                      'relative mr-px',
                      themeColors[Number(memoContent.tag)].text,
                    )}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className='rounded-lg p-4 z-10'>
                <RadioGroup
                  size='sm'
                  value={memoContent.tag}
                  onValueChange={(e) => {
                    setMemoContent({ ...memoContent, tag: e });
                    setIsPopoverOpen(false);
                  }}
                  color='default'
                >
                  {currentCalendarContent.tags.map((tag, index) => (
                    <Radio key={index} value={tag.colorCode} className='p-2'>
                      <div className='flex items-center gap-1 ml-2'>
                        <div
                          className={clsx(
                            'w-3 h-3 rounded-full',
                            themeColors[Number(tag.colorCode)].darkBackground,
                          )}
                        />
                        <div className='text-base'>{tag.name}</div>
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              </PopoverContent>
            </Popover>
            <input
              className={clsx(
                'border rounded-lg px-2 max-w-[150px] text-sm h-9 leading-9 placeholder:h-9',
                currentThemeColor.outline,
              )}
              placeholder='Press Enter to input'
              value={memoContent.title}
              onChange={(e) =>
                setMemoContent({ ...memoContent, title: e.target.value })
              }
              onKeyDown={(e) => {
                handleAddMemo(memoContent, isComposing, e);
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
          </div>
          <Button
            isLoading={isSubmitting}
            className={clsx(
              'w-full h-6 rounded-lg',
              currentThemeColor.lightBackground,
            )}
            onClick={() => handleAddMemo(memoContent)}
          >
            Submit
          </Button>
        </>
      );
    }

    if (type === CardType.List) {
      return memoEvents.length > 0 ? (
        <div className='flex flex-col gap-2'>
          {memoEvents.map((event, index) => (
            <DraggableItem
              id={event.eventId.toString()}
              key={index}
              className={clsx(
                'relative transition hover:scale-105 flex items-center justify-center gap-2 w-full p-3 h-12 rounded-lg shadow-md hover:cursor-pointer',
                themeColors[Number(event.tag)].lightBackground,
              )}
              onClick={() => setIsEditModalOpen(true, event)}
              event={event}
            >
              {event.title}
            </DraggableItem>
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center'>
          <MaterialSymbolsNoteStackAddRounded className='text-2xl mb-1 text-slate-400' />
          <div className='text-slate-400'>No memos yet.</div>
          <div className='text-slate-400'>Add one!</div>
        </div>
      );
    }
  };

  const renderCards = (type: CardType) => {
    return (
      <Card
        className={clsx(
          'shadow border-2',
          currentThemeColor.lightBorder,
          type === CardType.Add ? 'mt-2' : 'mt-4 relative',
        )}
      >
        <CardHeader>
          {type === CardType.Add
            ? CardType.Add
            : `${CardType.List} (${memoEvents.length})`}
        </CardHeader>
        <Divider />
        <CardBody>{renderCardBody(type)}</CardBody>
      </Card>
    );
  };

  return (
    <div className='py-4 px-3 flex flex-col gap-3 overflow-y-auto'>
      <div
        className={clsx(
          'shadow-md flex items-center justify-center gap-2 h-10 text-lg leading-10 bg-slate-200 rounded-xl outline outline-1 outline-offset-2 text-white',
          currentThemeColor.darkBackground,
          currentThemeColor.outline,
        )}
      >
        <MaterialSymbolsStickyNote2OutlineRounded />
        Memos
      </div>
      <div className='flex-col items-center justify-center gap-2'>
        {renderCards(CardType.Add)}
        {renderCards(CardType.List)}
      </div>
    </div>
  );
};

export { Memo };
