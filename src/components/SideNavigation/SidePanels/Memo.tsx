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
import MaterialSymbolsNoteStackAddRounded from '~icons/material-symbols/note-stack-add-rounded';
import MaterialSymbolsStickyNote2OutlineRounded from '~icons/material-symbols/sticky-note-2-outline-rounded';
import MdiTag from '~icons/mdi/tag'
import { useAuthStore } from '../../../store/authStore';
import { useModalStore } from '../../../store/modalStore';
import { addNewMemo } from '../../../utils/handleUserAndCalendar';
import { themeColors } from '../../../utils/theme';
import { CalendarContent, Event } from '../../../utils/types';

type Props = {
  memoEvents: Event[];
  currentCalendarContent: CalendarContent;
};

const Memo: React.FC<Props> = ({ memoEvents, currentCalendarContent }) => {
  const { setIsEditModalOpen } = useModalStore();
  const { currentThemeColor } = useAuthStore();
  const [selectedTag, setSelectedTag] = useState('0');
  const [memoInput, setMemoInput] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemoInput(e.target.value);
  };

  const handleAddMemo = async () => {
    await addNewMemo(selectedTag, memoInput, currentCalendarContent.calendarId);
    setMemoInput('');
    setSelectedTag('0');
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
        <Card
          className={clsx(
            'mt-2 shadow border-2',
            currentThemeColor.lightBorder,
          )}
        >
          <CardHeader>
            <div>Add Memo</div>
          </CardHeader>
          <Divider />
          <CardBody>
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
                        themeColors[Number(selectedTag)].text,
                      )}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className='rounded-lg p-4 z-10'>
                  <RadioGroup
                    size='sm'
                    value={selectedTag}
                    onValueChange={(e) => {
                      setSelectedTag(e);
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
                value={memoInput}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isComposing && memoInput) {
                    handleAddMemo();
                  }
                }}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
              />
            </div>
            <Button
              className={clsx(
                'w-full h-6 rounded-lg',
                currentThemeColor.lightBackground,
              )}
              onClick={handleAddMemo}
              disabled={!memoInput}
            >
              Submit
            </Button>
          </CardBody>
        </Card>

        <Card
          className={clsx('mt-4 shadow border-2', currentThemeColor.lightBorder)}
        >
          <CardHeader>
            <div>Memo List ({memoEvents.length})</div>
          </CardHeader>
          <Divider />
          <CardBody>
            {memoEvents.length > 0 ? (
              <div className='flex flex-col gap-2'>
                {memoEvents.map((event, index) => (
                  <div
                    key={index}
                    className={clsx(
                      'transform transition hover:scale-105 flex items-center justify-center gap-2 w-full p-3 h-12 rounded-lg shadow-md hover:cursor-pointer',
                      themeColors[Number(event.tag)].lightBackground,
                    )}
                    onClick={() => {
                      setIsEditModalOpen(true, event);
                    }}
                  >
                    <div className='truncate'>{event.title}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center'>
                <MaterialSymbolsNoteStackAddRounded className='text-2xl mb-1 text-slate-400' />
                <div className='text-slate-400'>No memos yet.</div>
                <div className='text-slate-400'>Add one!</div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Memo;
