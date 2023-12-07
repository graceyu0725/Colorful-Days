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
import MdiTagMultiple from '~icons/mdi/tag-multiple';
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
  // const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMemoInput(e.target.value);
  };

  const handleAddMemo = async () => {
    // setIsLoading(true);
    await addNewMemo(selectedTag, memoInput, currentCalendarContent.calendarId);
    setMemoInput('');
    setSelectedTag('0');
    // setIsLoading(false);
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
        <Card className='mt-2 shadow border'>
          <CardHeader>
            <div>Add Memo</div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className='w-full flex items-center justify-between mb-2'>
              <Popover
                placement='bottom-start'
                isOpen={isPopoverOpen}
                onOpenChange={(open) => setIsPopoverOpen(open)}
              >
                <PopoverTrigger className='hover:cursor-pointer'>
                  <div>
                    <MdiTagMultiple
                      className={clsx(
                        'text-lg relative',
                        themeColors[Number(selectedTag)].text,
                      )}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className='rounded-lg p-4 z-10'>
                  <RadioGroup
                    size='sm'
                    value={selectedTag}
                    onValueChange={setSelectedTag}
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
                className='border rounded-lg px-2 w-[150px] text-sm h-9 leading-10 focus:outline-slate-300'
                placeholder='Press Enter to input'
                value={memoInput}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddMemo();
                  }
                }}
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

        <Card className='mt-4 shadow border'>
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

        {/* <div className='mt-10'>Memo ({memoEvents.length})</div>
        <Divider />
        <div className='flex flex-col gap-2 mt-2'>
          {memoEvents.map((event, index) => (
            <div
              key={index}
              className={clsx(
                'flex items-center justify-center gap-2 w-full p-3 h-12 rounded-lg shadow hover:cursor-pointer',
                themeColors[Number(event.tag)].lightBackground,
              )}
              onClick={() => {
                setIsEditModalOpen(true, event);
              }}
            >
              <div className='truncate'>{event.title}</div>
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default Memo;
