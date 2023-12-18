import {
  Button,
  Divider,
  Input,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Switch,
  Textarea,
} from '@nextui-org/react';
import clsx from 'clsx';
import { addMinutes } from 'date-fns';
import DatePicker from 'react-datepicker';
import toast from 'react-hot-toast';
import FluentNotepad28Filled from '~icons/fluent/notepad-28-filled';
import MaterialSymbolsNestClockFarsightAnalog from '~icons/material-symbols/nest-clock-farsight-analog';
import MdiTag from '~icons/mdi/tag';
import { themeColors } from '../../utils/theme';
import { CalendarContent, Event } from '../../utils/types';

export const datePickerColors = [
  '#9879704D',
  '#577BAD4D',
  '#7584674D',
  '#DD8A624D',
  '#9D91A74D',
  '#8FBBC14D',
  '#E7B7524D',
  '#D984814D',
];

export interface CreateEvent {
  tag: string;
  eventId: number;
  title: string;
  startAt: Date;
  endAt: Date;
  isAllDay: boolean;
  isMemo: boolean;
  note: string;
  createdAt: null;
  updatedAt: null;
  messages: never[];
}

// ===================================================================
// Handle input & button clicking
// ===================================================================

export const updateUserInput = (
  label: keyof Event,
  value: any,
  setUserInput: (value: React.SetStateAction<CreateEvent | Event>) => void,
  setIsTitleEmpty: (value: React.SetStateAction<boolean>) => void,
) => {
  setUserInput((prev) => {
    if (prev[label] === value) {
      return prev;
    }
    const updatedInput = { ...prev, [label]: value };
    if (
      label === 'startAt' &&
      updatedInput.endAt &&
      addMinutes(value, 15) >= updatedInput.endAt
    ) {
      updatedInput.endAt = addMinutes(value, 15);
    }

    if (updatedInput.startAt && updatedInput.endAt) {
      if (label === 'endAt' && value < addMinutes(updatedInput.startAt, 15)) {
        updatedInput.endAt = addMinutes(updatedInput.startAt, 15);
        toast.error('End time cannot be earlier than start time!');
      }
    }

    if (label === 'isAllDay' || label === 'isMemo') {
      updatedInput[label] = !prev[label];
    }

    if (label === 'title') {
      setIsTitleEmpty(false);
    }
    return updatedInput;
  });
};

// ===================================================================
// Handle rendering
// ===================================================================

export const renderTags = (
  isPopoverOpen: boolean,
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>,
  userInput: CreateEvent | Event,
  setUserInput: (value: React.SetStateAction<CreateEvent | Event>) => void,
  currentCalendarContent: CalendarContent,
) => {
  return (
    <div className='w-full flex items-center '>
      <Popover
        placement='bottom-start'
        isOpen={isPopoverOpen}
        onOpenChange={(open) => setIsPopoverOpen(open)}
      >
        <PopoverTrigger className='hover:cursor-pointer bg-[#f3f3f4] px-4 rounded-lg h-10 hover:bg-[#e0e0e3] min-w-fit'>
          <div className='flex items-center gap-2'>
            <div
              className={clsx(
                'w-3 h-3 rounded-full',
                themeColors[Number(userInput.tag)].darkBackground,
              )}
            />
            <div className='text-sm xs:text-base'>
              {currentCalendarContent.tags[Number(userInput.tag)].name}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='rounded-lg p-4 z-10'>
          <RadioGroup
            size='sm'
            value={userInput.tag}
            onValueChange={(e) => {
              setUserInput((prev) => ({ ...prev, tag: e }));
              setIsPopoverOpen(false);
              document.documentElement.style.setProperty(
                '--main-bg-color',
                datePickerColors[Number(e)],
              );
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
                  <div className='text-sm xs:text-base'>{tag.name}</div>
                </div>
              </Radio>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const renderDatePicker = (
  type: string,
  userInput: CreateEvent | Event,
  setUserInput: (value: React.SetStateAction<CreateEvent | Event>) => void,
  setIsTitleEmpty: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  if (type === 'allDay') {
    return (
      <div className='flex items-center gap-2'>
        <MaterialSymbolsNestClockFarsightAnalog
          className={clsx(
            'min-w-[20px] text-xl transition-colors',
            themeColors[Number(userInput.tag)].text,
          )}
        />
        <div className='grow flex items-start justify-between'>
          <DatePicker
            aria-label='startDate'
            selected={userInput.startAt}
            selectsStart
            dateFormat='MMM dd, yyyy'
            className={clsx(
              'border rounded-md h-8 w-36 xs:w-40 sm:w-48 text-center text-sm sm:text-base focus:outline-2',
              themeColors[Number(userInput.tag)].outline,
            )}
            onChange={(e) =>
              updateUserInput('startAt', e, setUserInput, setIsTitleEmpty)
            }
          />
          <div className='w-5 h-8 leading-8'>－</div>
          <DatePicker
            aria-label='endDate'
            selected={userInput.endAt}
            selectsEnd
            minDate={userInput.startAt}
            dateFormat='MMM dd, yyyy'
            className={clsx(
              'border rounded-md h-8 w-36 xs:w-40 sm:w-48 text-center text-sm sm:text-base focus:outline-2',
              themeColors[Number(userInput.tag)].outline,
            )}
            onChange={(e) =>
              updateUserInput('endAt', e, setUserInput, setIsTitleEmpty)
            }
          />
        </div>
      </div>
    );
  } else if (type === 'memo') {
    return <></>;
  }

  return (
    <div className='flex items-center gap-2'>
      <MaterialSymbolsNestClockFarsightAnalog
        className={clsx(
          'min-w-[20px] text-xl transition-colors',
          themeColors[Number(userInput.tag)].text,
        )}
      />
      <div className='grow flex items-start justify-between'>
        <DatePicker
          aria-label='startDate'
          selected={userInput.startAt}
          selectsStart
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='MMM dd, yyyy HH:mm'
          className={clsx(
            'border rounded-md h-8 w-36 xs:w-40 sm:w-48 text-center text-sm sm:text-base focus:outline-2',
            themeColors[Number(userInput.tag)].outline,
          )}
          onChange={(e) =>
            updateUserInput('startAt', e, setUserInput, setIsTitleEmpty)
          }
        />
        <div className='w-5 h-8 leading-8'>－</div>
        <DatePicker
          aria-label='endDate'
          selected={userInput.endAt}
          selectsEnd
          minDate={userInput.startAt}
          showTimeSelect
          timeFormat='HH:mm'
          timeIntervals={15}
          timeCaption='Time'
          dateFormat='MMM dd, yyyy HH:mm'
          className={clsx(
            'border rounded-md h-8 w-36 xs:w-40 sm:w-48 text-center text-sm sm:text-base focus:outline-2',
            themeColors[Number(userInput.tag)].outline,
          )}
          onChange={(e) =>
            updateUserInput('endAt', e, setUserInput, setIsTitleEmpty)
          }
        />
      </div>
    </div>
  );
};

export const renderModalContent = (
  isComposing: boolean,
  setIsComposing: React.Dispatch<React.SetStateAction<boolean>>,
  header: string,
  userInput: CreateEvent | Event,
  setUserInput: (value: React.SetStateAction<Event | CreateEvent>) => void,
  setIsTitleEmpty: React.Dispatch<React.SetStateAction<boolean>>,
  isPopoverOpen: boolean,
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentCalendarContent: CalendarContent,
  isTitleEmpty: boolean,
  handleCancel: () => void,
  handleSubmit: () => Promise<void>,
  isSaving: boolean,
  isEditing?: boolean,
) => {
  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <>
      <ModalHeader className='py-3'>{header}</ModalHeader>
      <Divider />
      <ModalBody className='overflow-y-auto'>
        <Input
          isReadOnly={!isEditing}
          aria-label='title'
          type='text'
          variant='underlined'
          placeholder='Title'
          value={userInput.title}
          onChange={(e) =>
            updateUserInput(
              'title',
              e.target.value,
              setUserInput,
              setIsTitleEmpty,
            )
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) {
              handleSubmit();
            }
          }}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className=''
        />
        {userInput.isAllDay &&
          !userInput.isMemo &&
          renderDatePicker('allDay', userInput, setUserInput, setIsTitleEmpty)}
        {userInput.isMemo &&
          renderDatePicker('memo', userInput, setUserInput, setIsTitleEmpty)}
        {!userInput.isAllDay &&
          !userInput.isMemo &&
          renderDatePicker('normal', userInput, setUserInput, setIsTitleEmpty)}

        {!userInput.isMemo && (
          <Switch
            color='default'
            size='sm'
            className='pl-8'
            aria-label='allDay'
            isSelected={userInput.isAllDay}
            onChange={(e) =>
              updateUserInput('isAllDay', e, setUserInput, setIsTitleEmpty)
            }
          >
            All-day
          </Switch>
        )}

        <Switch
          color='default'
          size='sm'
          className='pl-8'
          aria-label='saveAsMemo'
          isSelected={userInput.isMemo}
          onChange={(e) =>
            updateUserInput('isMemo', e, setUserInput, setIsTitleEmpty)
          }
        >
          Save as memo
        </Switch>

        <div className='flex items-center gap-2'>
          <MdiTag
            className={clsx(
              'text-xl transition-colors',
              themeColors[Number(userInput.tag)].text,
            )}
          />
          {renderTags(
            isPopoverOpen,
            setIsPopoverOpen,
            userInput,
            setUserInput,
            currentCalendarContent,
          )}
        </div>

        <div className='flex items-start gap-2'>
          <FluentNotepad28Filled
            className={clsx(
              'text-xl transition-colors',
              themeColors[Number(userInput.tag)].text,
            )}
          />
          <Textarea
            value={userInput.note}
            minRows={4}
            maxRows={4}
            onChange={(e) =>
              updateUserInput(
                'note',
                e.target.value,
                setUserInput,
                setIsTitleEmpty,
              )
            }
          />
        </div>
      </ModalBody>

      <ModalFooter className='flex items-center'>
        {isTitleEmpty && (
          <div className='text-sm text-red-500 text-end pr-1'>
            Please enter title!
          </div>
        )}
        <div className='w-2/3 flex gap-2'>
          <Button variant='bordered' onPress={handleCancel} className='w-1/2'>
            Cancel
          </Button>
          <Button
            isLoading={isSaving}
            color='primary'
            onPress={handleSubmit}
            className={clsx(
              'w-1/2',
              themeColors[Number(userInput.tag)].darkBackground,
            )}
            disabled={!userInput.title}
          >
            Save
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};
