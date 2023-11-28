export interface EventMessages {
  arthur: object;
  content: string;
  createdAt: Date | null;
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
  updatedAt: Date | null;
  messages: EventMessages[];
}

export const initialEvent = {
  eventId: 0,
  title: '',
  startAt: new Date(),
  endAt: new Date(),
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

interface CalendarMember {
  email: string;
  name: string;
  id: string;
}

export interface CalendarTag {
  colorCode: string;
  name: string;
}

export const defaultTags = [
  {
    colorCode: '0',
    name: 'tag1',
  },
  {
    colorCode: '1',
    name: 'tag2',
  },
  {
    colorCode: '2',
    name: 'tag3',
  },
  {
    colorCode: '3',
    name: 'tag4',
  },
  {
    colorCode: '4',
    name: 'tag5',
  },
  {
    colorCode: '5',
    name: 'tag6',
  },
  {
    colorCode: '6',
    name: 'tag7',
  },
  {
    colorCode: '7',
    name: 'tag8',
  },
];

export interface CalendarContent {
  members: CalendarMember[];
  name: string;
  tags: CalendarTag[];
  themeColor: string;
}

export const initialCalendarContent = {
  members: [
    {
      email: '',
      name: '',
      id: '',
    },
  ],
  name: '',
  tags: [
    {
      colorCode: '',
      name: '',
    },
  ],
  themeColor: '',
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
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}
