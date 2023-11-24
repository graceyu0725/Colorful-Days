import clsx from 'clsx';
import { useState } from 'react';
import { useEventsStore } from '../../../store/eventsStore';
import {
  generateMonthDates,
  getSplitEvents,
  isSameDay,
  isSameMonth,
  splitDatesIntoWeeks,
} from '../../../utils/handleDatesAndEvents';

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  formateDate: string;
  setFormateDate: React.Dispatch<React.SetStateAction<string>>;
};

const WeeklyView: React.FC<Props> = ({ date }) => {


  return (
    <div className='mt-1 w-full border-t'>Hello</div>
  );
};

export default WeeklyView;
