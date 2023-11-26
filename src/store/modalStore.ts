import { create } from 'zustand';
import { Event, initialEvent } from '../utils/types';

interface ModalState {
  isCreateModalOpen: boolean;
  selectedStartDate: Date;
  selectedEndDate: Date;
  setSelectedStartDate: (date: Date) => void;
  setIsCreateModalOpen: (
    isOpen: boolean,
    startDate: Date,
    endDate: Date,
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
  setIsCreateModalOpen: (isOpen, startDate, endDate) =>
    set({
      isCreateModalOpen: isOpen,
      selectedStartDate: startDate,
      selectedEndDate: endDate,
    }),
  isEditModalOpen: false,
  selectedEvent: initialEvent,
  setIsEditModalOpen: (isOpen, event) =>
    set({ isEditModalOpen: isOpen, selectedEvent: event }),
}));
