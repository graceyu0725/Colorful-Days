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
import { CalendarContent, CreateEvent, Event } from '../../utils/types';

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

const updateEventDetail = (
  label: keyof Event,
  value: any,
  setEventDetail: (value: React.SetStateAction<CreateEvent | Event>) => void,
) => {
  setEventDetail((prev) => {
    if (prev[label] === value) {
      return prev;
    }
    const updatedDetail = { ...prev, [label]: value };
    if (
      label === 'startAt' &&
      updatedDetail.endAt &&
      addMinutes(value, 15) >= updatedDetail.endAt
    ) {
      updatedDetail.endAt = addMinutes(value, 15);
    }

    if (updatedDetail.startAt && updatedDetail.endAt) {
      if (label === 'endAt' && value < addMinutes(updatedDetail.startAt, 15)) {
        updatedDetail.endAt = addMinutes(updatedDetail.startAt, 15);
        toast.error('End time cannot be earlier than start time!');
      }
    }

    if (label === 'isAllDay' || label === 'isMemo') {
      updatedDetail[label] = !prev[label];
    }

    return updatedDetail;
  });
};

const renderTags = (
  isPopoverOpen: boolean,
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>,
  eventDetail: CreateEvent | Event,
  setEventDetail: (value: React.SetStateAction<CreateEvent | Event>) => void,
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
                themeColors[Number(eventDetail.tag)].darkBackground,
              )}
            />
            <div className='text-sm xs:text-base'>
              {currentCalendarContent.tags[Number(eventDetail.tag)].name}
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className='rounded-lg p-4 z-10'>
          <RadioGroup
            size='sm'
            value={eventDetail.tag}
            onValueChange={(e) => {
              setEventDetail((prev) => ({ ...prev, tag: e }));
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
  eventDetail: CreateEvent | Event,
  setEventDetail: (value: React.SetStateAction<CreateEvent | Event>) => void,
) => {
  if (type === 'memo') return;

  return (
    <div className='flex items-center gap-2'>
      <MaterialSymbolsNestClockFarsightAnalog
        className={clsx(
          'min-w-[20px] text-xl transition-colors',
          themeColors[Number(eventDetail.tag)].text,
        )}
      />
      <div className='grow flex items-start justify-between'>
        <DatePicker
          aria-label='startDate'
          selected={eventDetail.startAt}
          selectsStart
          showTimeSelect={type !== 'allDay'}
          timeFormat={type === 'allDay' ? '' : 'HH:mm'}
          timeIntervals={type === 'allDay' ? 0 : 15}
          timeCaption='Time'
          dateFormat={type === 'allDay' ? 'MMM dd, yyyy' : 'MMM dd, yyyy HH:mm'}
          className={clsx(
            'border rounded-md h-8 w-36 xs:w-40 sm:w-48 text-center text-sm sm:text-base focus:outline-2',
            themeColors[Number(eventDetail.tag)].outline,
          )}
          onChange={(e) => updateEventDetail('startAt', e, setEventDetail)}
        />
        <div className='w-5 h-8 leading-8'>－</div>
        <DatePicker
          aria-label='endDate'
          selected={eventDetail.endAt}
          selectsEnd
          minDate={eventDetail.startAt}
          showTimeSelect={type !== 'allDay'}
          timeFormat={type === 'allDay' ? '' : 'HH:mm'}
          timeIntervals={type === 'allDay' ? 0 : 15}
          timeCaption='Time'
          dateFormat={type === 'allDay' ? 'MMM dd, yyyy' : 'MMM dd, yyyy HH:mm'}
          className={clsx(
            'border rounded-md h-8 w-36 xs:w-40 sm:w-48 text-center text-sm sm:text-base focus:outline-2',
            themeColors[Number(eventDetail.tag)].outline,
          )}
          onChange={(e) => updateEventDetail('endAt', e, setEventDetail)}
        />
      </div>
    </div>
  );
};

export const renderModalContent = (
  isComposing: boolean,
  setIsComposing: React.Dispatch<React.SetStateAction<boolean>>,
  header: string,
  eventDetail: CreateEvent | Event,
  setEventDetail: (value: React.SetStateAction<Event | CreateEvent>) => void,
  isPopoverOpen: boolean,
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>,
  currentCalendarContent: CalendarContent,
  handleCancel: () => void,
  handleSubmit: () => Promise<void>,
  isSaving: boolean,
  isEditing?: boolean,
) => {
  let datePickerType = '';
  if (eventDetail.isAllDay && !eventDetail.isMemo) {
    datePickerType = 'allDay';
  } else if (eventDetail.isMemo) {
    datePickerType = 'memo';
  } else if (!eventDetail.isAllDay && !eventDetail.isMemo) {
    datePickerType = 'normal';
  }

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
          value={eventDetail.title}
          onChange={(e) =>
            updateEventDetail('title', e.target.value, setEventDetail)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isComposing) {
              handleSubmit();
            }
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          className=''
        />

        {datePickerType &&
          renderDatePicker(datePickerType, eventDetail, setEventDetail)}

        {!eventDetail.isMemo && (
          <Switch
            color='default'
            size='sm'
            className='pl-8'
            aria-label='allDay'
            isSelected={eventDetail.isAllDay}
            onChange={(e) => updateEventDetail('isAllDay', e, setEventDetail)}
          >
            All-day
          </Switch>
        )}

        <Switch
          color='default'
          size='sm'
          className='pl-8'
          aria-label='saveAsMemo'
          isSelected={eventDetail.isMemo}
          onChange={(e) => updateEventDetail('isMemo', e, setEventDetail)}
        >
          Save as memo
        </Switch>

        <div className='flex items-center gap-2'>
          <MdiTag
            className={clsx(
              'text-xl transition-colors',
              themeColors[Number(eventDetail.tag)].text,
            )}
          />
          {renderTags(
            isPopoverOpen,
            setIsPopoverOpen,
            eventDetail,
            setEventDetail,
            currentCalendarContent,
          )}
        </div>

        <div className='flex items-start gap-2'>
          <FluentNotepad28Filled
            className={clsx(
              'text-xl transition-colors',
              themeColors[Number(eventDetail.tag)].text,
            )}
          />
          <Textarea
            value={eventDetail.note}
            minRows={4}
            maxRows={4}
            onChange={(e) =>
              updateEventDetail('note', e.target.value, setEventDetail)
            }
          />
        </div>
      </ModalBody>

      <ModalFooter className='flex items-center'>
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
              themeColors[Number(eventDetail.tag)].darkBackground,
            )}
          >
            Save
          </Button>
        </div>
      </ModalFooter>
    </>
  );
};
