import {
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import EosIconsLoading from '~icons/eos-icons/loading';
import MaterialSymbolsSubdirectoryArrowLeftRounded from '~icons/material-symbols/subdirectory-arrow-left-rounded';
import { useModalStore } from '../../../store/modalStore';
import { themeColors } from '../../../utils/theme';
import { CalendarContent, Event } from '../../../utils/types';
import {addNewMemo} from "../../../utils/handleUserAndCalendar"

type Props = {
  memoEvents: Event[];
  currentCalendarContent: CalendarContent;
};

const Memo: React.FC<Props> = ({ memoEvents, currentCalendarContent }) => {
  const { setIsEditModalOpen } = useModalStore();
  const [selectedTag, setSelectedTag] = useState('0');
  const [memoInput, setMemoInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleInputChange = (e) => {
    setMemoInput(e.target.value);
  };

  const handleAddMemo = () => {
    setIsLoading(true)
    addNewMemo(selectedTag,memoInput,currentCalendarContent.calendarId)
    setIsLoading(false)
  };

  return (
    <div className='py-3 px-4 flex flex-col gap-3 overflow-y-auto'>
      <div className='text-center'>Memo</div>
      <div className='flex-col items-center justify-center gap-2'>
        <div className='flex-col items-center justify-center gap-2 mt-2'>
          <div>Add Memo</div>
          <Divider />
          <div className='flex items-center justify-between mb-2 mt-2'>
            <Popover
              placement='bottom-start'
              isOpen={isPopoverOpen}
              onOpenChange={(open) => setIsPopoverOpen(open)}
            >
              <PopoverTrigger className='hover:cursor-pointer'>
                <div
                  className={clsx(
                    'ml-1 w-2 h-2 outline outline-1 outline-offset-2 outline-slate-300 rounded-full bg-slate-500',
                    themeColors[Number(selectedTag)].bg,
                  )}
                />
              </PopoverTrigger>
              <PopoverContent className='rounded-lg p-4 gap-'>
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
                            themeColors[Number(tag.colorCode)].bg,
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
              className='border rounded px-2 w-36 text-sm h-8'
              placeholder='Press enter to input'
              value={memoInput}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddMemo();
                }
              }}
            />
            <MaterialSymbolsSubdirectoryArrowLeftRounded
              className='w-5 h-5 hover:cursor-pointer'
              onClick={handleAddMemo}
            />
          </div>

          {isLoading && <EosIconsLoading />}
        </div>

        <div className='mt-10'>Memo ({memoEvents.length})</div>
        <Divider />
        <div className='flex flex-col gap-2 mt-2'>
          {memoEvents.map((event, index) => (
            <div
              key={index}
              className={clsx(
                'flex items-center justify-center gap-2 w-full p-3 h-12 rounded-lg shadow hover:cursor-pointer',
                themeColors[Number(event.tag)].light,
              )}
              onClick={() => {
                setIsEditModalOpen(true, event);
              }}
            >
              <div className='truncate'>{event.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Memo;
