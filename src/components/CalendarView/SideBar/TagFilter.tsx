import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
  Tooltip,
} from '@nextui-org/react';
import clsx from 'clsx';
import MaterialSymbolsRemoveSelection from '~icons/material-symbols/remove-selection';
import MaterialSymbolsSelectCheckBox from '~icons/material-symbols/select-check-box';
import { useAuthStore } from '../../../store/authStore';
import { useEventsStore } from '../../../store/eventsStore';
import { themeColors } from '../../../utils/theme';
import { CalendarTag } from '../../../utils/types';

type Props = {
  calendarTags: CalendarTag[];
};

const TagFilter: React.FC<Props> = ({ calendarTags }) => {
  const { selectedEventTags, setSelectedEventTags } = useEventsStore();
  const { currentThemeColor } = useAuthStore();

  return (
    <div className='mb-2'>
      <Card
        className={clsx(
          'w-full h-full shadow border-2',
          currentThemeColor.lightBorder,
        )}
      >
        <CardHeader className='flex justify-between'>
          <p>Tag Filter</p>
          <div className='flex'>
            <Tooltip showArrow={true} placement='bottom' content='Select all'>
              <Button
                variant='bordered'
                className='p-0 min-w-unit-7 h-6 border-none'
                onClick={() =>
                  setSelectedEventTags(['0', '1', '2', '3', '4', '5', '6', '7'])
                }
              >
                <MaterialSymbolsSelectCheckBox className='w-7' />
              </Button>
            </Tooltip>
            <Tooltip showArrow={true} placement='bottom' content='Deselect all'>
              <Button
                variant='bordered'
                className='p-0 min-w-unit-7 h-6 border-none'
                onClick={() => setSelectedEventTags([])}
              >
                <MaterialSymbolsRemoveSelection className='w-7' />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <Divider />
        <CardBody className='overscroll-x-none'>
          <div className='flex flex-col gap-3'>
            <CheckboxGroup
              color='default'
              value={selectedEventTags}
              onValueChange={(newSelected) => {
                setSelectedEventTags(newSelected);
              }}
            >
              {calendarTags.map((tag, index) => (
                <Checkbox key={index} value={tag.colorCode}>
                  <div className='flex items-center gap-2'>
                    <div
                      className={clsx(
                        'rounded-full w-3 h-3',
                        themeColors[index].darkBackground,
                      )}
                    />
                    <div className='text-sm truncate'>{tag.name}</div>
                  </div>
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TagFilter;
