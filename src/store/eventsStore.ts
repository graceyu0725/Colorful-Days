import { create } from 'zustand';
import { Event } from '../utils/types';

interface eventsState {
  selectedEventTags: string[];
  setSelectedEventTags: (tag: string[]) => void;
  calendarAllEvents: Event[];
  setCalendarAllEvents: (event: Event[]) => void;
  allEvents: Event[];
  setAllEvents: (event: Event[]) => void;
}

export const useEventsStore = create<eventsState>((set) => ({
  selectedEventTags: ['0', '1', '2', '3', '4', '5', '6', '7'],
  setSelectedEventTags: (tags) => {
    set((state) => {
      const tagFilteredEvents = state.calendarAllEvents.filter((event) =>
        tags.includes(event.tag),
      );

      return { selectedEventTags: tags, allEvents: tagFilteredEvents };
    });
  },
  calendarAllEvents: [],
  setCalendarAllEvents: (events) => {
    set((state) => {
      const tagFilteredEvents = events.filter((event) =>
        state.selectedEventTags.includes(event.tag),
      );
      return { calendarAllEvents: events, allEvents: tagFilteredEvents };
    });
  },
  allEvents: [],
  setAllEvents: (event) => set({ allEvents: event }),
}));
