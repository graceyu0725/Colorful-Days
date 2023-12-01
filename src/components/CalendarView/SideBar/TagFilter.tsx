import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Divider,
} from '@nextui-org/react';
import clsx from 'clsx';
import MaterialSymbolsRemoveSelection from '~icons/material-symbols/remove-selection';
import MaterialSymbolsSelectCheckBox from '~icons/material-symbols/select-check-box';
import { useEventsStore } from '../../../store/eventsStore';
import { themeColors } from '../../../utils/theme';
import { CalendarTag } from '../../../utils/types';

type Props = {
  calendarTags: CalendarTag[];
};

const TagFilter: React.FC<Props> = ({ calendarTags }) => {
  const { selectedEventTags, setSelectedEventTags } = useEventsStore();

  return (
    <div className='h-1/2 px-2 mb-4 mt-1'>
      <Card className='w-full h-full rounded-lg shadow border'>
        <CardHeader className='flex justify-between'>
          <p>Tags Filter</p>
          <div className='flex gap-2'>
            <MaterialSymbolsSelectCheckBox
              className='hover:cursor-pointer'
              onClick={() =>
                setSelectedEventTags(['0', '1', '2', '3', '4', '5', '6', '7'])
              }
            />
            <MaterialSymbolsRemoveSelection
              className='hover:cursor-pointer'
              onClick={() => setSelectedEventTags([])}
            />
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
                        themeColors[index].bg,
                      )}
                    ></div>
                    <p>{tag.name}</p>
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
