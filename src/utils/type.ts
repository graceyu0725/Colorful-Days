export interface EventMessages {
  arthur: object;
  content: string;
  createdAt: Date | null;
}

export interface Event {
  eventId: number;
  title: string;
  startAt: Date;
  endAt: Date;
  isAllDay: boolean;
  isMemo: boolean;
  tag: string;
  note: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  messages: EventMessages[];
}
