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