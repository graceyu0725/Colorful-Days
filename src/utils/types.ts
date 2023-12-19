import { addMinutes } from 'date-fns';
import { FieldValue, Timestamp } from 'firebase/firestore';

export interface EventMessages {
  arthur: User;
  content: string;
  createdAt: Timestamp | null;
}

export interface Event {
  eventId: number;
  title: string;
  startAt: Date | null;
  endAt: Date | null;
  isAllDay: boolean;
  isMemo: boolean;
  tag: string;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null | FieldValue;
  messages: EventMessages[];
}

export const initialEvent = {
  eventId: 0,
  title: '',
  startAt: new Date(),
  endAt: addMinutes(new Date(), 15),
  isAllDay: false,
  isMemo: false,
  tag: '0',
  note: '',
  createdAt: null,
  updatedAt: null,
  messages: [],
};

export interface User {
  userId: string;
  name: string;
  email: string;
  avatar: string;
  calendars: string[];
}

export const initialUser = {
  userId: '',
  name: '',
  email: '',
  avatar: '',
  calendars: [''],
};

// interface CalendarMember {
//   email: string;
//   name: string;
//   id: string;
// }

export interface CalendarTag {
  colorCode: string;
  name: string;
}

export const defaultTags = [
  {
    colorCode: '0',
    name: 'Appointments',
  },
  {
    colorCode: '1',
    name: 'Work',
  },
  {
    colorCode: '2',
    name: 'Fitness',
  },
  {
    colorCode: '3',
    name: 'Family',
  },
  {
    colorCode: '4',
    name: 'Holidays',
  },
  {
    colorCode: '5',
    name: 'Travel',
  },
  {
    colorCode: '6',
    name: 'Education',
  },
  {
    colorCode: '7',
    name: 'Important Dates',
  },
];

export interface CalendarContent {
  members: string[];
  name: string;
  tags: CalendarTag[];
  themeColor: string;
  calendarId: string;
}

export const initialCalendarContent = {
  members: [''],
  name: '',
  tags: [
    {
      colorCode: '',
      name: '',
    },
  ],
  themeColor: '0',
  calendarId: '',
};

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface UserSignIn {
  email: string;
  password: string;
}

export interface CalendarInfo {
  name: string;
  themeColor: string;
}

export interface GoogleUserInfo {
  uid: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
}
