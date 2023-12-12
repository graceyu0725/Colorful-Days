import { create } from 'zustand';
import { Event, initialEvent } from '../utils/types';

interface ModalState {
  isCreateModalOpen: boolean;
  selectedStartDate: Date;
  selectedEndDate: Date;
  selectedIsAllDay: boolean;
  setSelectedStartDate: (date: Date) => void;
  setIsCreateModalOpen: (
    isOpen: boolean,
    startDate: Date,
    endDate: Date,
    isAllDay: boolean,
  ) => void;
  isEditModalOpen: boolean;
  selectedEvent: Event;
  setSelectedEvent: (event: Event) => void;
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void;
  eventsToShow: (Event|null)[];
  isMoreModalOpen: boolean;
  setIsMoreModalOpen: (isOpen: boolean, events: (Event | null)[]) => void;
  isAddCalendarModalOpen: boolean;
  setIsAddCalendarModalOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateModalOpen: false,
  selectedStartDate: new Date(),
  setSelectedStartDate: (date) => {
    set({ selectedStartDate: date });
  },
  selectedEndDate: new Date(),
  selectedIsAllDay: false,
  setIsCreateModalOpen: (isOpen, startDate, endDate, isAllDay) =>
    set({
      isCreateModalOpen: isOpen,
      selectedStartDate: startDate,
      selectedEndDate: endDate,
      selectedIsAllDay: isAllDay,
    }),
  isEditModalOpen: false,
  selectedEvent: initialEvent,
  setSelectedEvent: (event) => set({ selectedEvent: event }),
  setIsEditModalOpen: (isOpen, event) =>
    set({ isEditModalOpen: isOpen, selectedEvent: event }),
  eventsToShow: [initialEvent],
  isMoreModalOpen: false,
  setIsMoreModalOpen: (isOpen, events) =>
    set({ isMoreModalOpen: isOpen, eventsToShow: events }),
  isAddCalendarModalOpen: false,
  setIsAddCalendarModalOpen: (isOpen) =>
    set({ isAddCalendarModalOpen: isOpen }),
}));
