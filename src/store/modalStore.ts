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
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void;
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
  setIsEditModalOpen: (isOpen, event) =>
    set({ isEditModalOpen: isOpen, selectedEvent: event }),
}));
