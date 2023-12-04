import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import MaterialSymbolsArrowForwardIosRounded from '~icons/material-symbols/arrow-forward-ios-rounded';
import { CalendarContent } from '../../../utils/types';

type Props = {
  currentCalendarContent: CalendarContent;
  currentCalendarId: string;
};

const Settings: React.FC<Props> = ({
  currentCalendarContent,
  currentCalendarId,
}) => {
  const defaultContent =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  console.log('currentCalendarContent', currentCalendarContent);

  return (
    <div className='py-3 px-4 flex flex-col gap-3 overflow-y-auto'>
      <div className='text-center'>Calendar Settings</div>
      <div className='flex flex-col items-center justify-center gap-1'>

          <Popover placement='bottom-start'>
            <PopoverTrigger>
              <Button className='border bg-slate-200 w-full rounded-lg'>
                <div className='flex items-center'>
                  <div className='text-base text-start w-36 truncate'>
                    {currentCalendarContent.name}
                  </div>
                  <MaterialSymbolsArrowForwardIosRounded className='w-4 h-4 ml-1 -mr-1' />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='px-1 py-2'>
                <div className='text-small font-bold'>Popover Content</div>
                <div className='text-tiny'>This is the popover content</div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover placement='bottom-start' className=''>
            <PopoverTrigger>
              <Button className='border bg-slate-200 w-full rounded-lg'>
                <div className='flex items-center'>
                  <div className='text-base text-start w-36 truncate'>
                    Calendar Color
                  </div>
                  <MaterialSymbolsArrowForwardIosRounded className='w-4 h-4 ml-1 -mr-1' />
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <div className='px-1 py-2'>
                <div className='text-small font-bold'>Popover Content</div>
                <div className='text-tiny'>This is the popover content</div>
              </div>
            </PopoverContent>
          </Popover>
      </div>
    </div>
  );
};

export default Settings;
