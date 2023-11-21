import { create } from 'zustand';
import { Event, initialEvent } from '../utils/type';

interface ModalState {
  isCreateModalOpen: boolean;
  selectedDate: Date;
  setIsCreateModalOpen: (isOpen: boolean, date: Date) => void;
  isEditModalOpen: boolean;
  selectedEvent: Event;
  setIsEditModalOpen: (isOpen: boolean, event: Event) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateModalOpen: false,
  selectedDate: new Date(),
  setIsCreateModalOpen: (isOpen, date) =>
    set({ isCreateModalOpen: isOpen, selectedDate: date }),
  isEditModalOpen: false,
  selectedEvent: initialEvent,
  setIsEditModalOpen: (isOpen, event) =>
    set({ isEditModalOpen: isOpen, selectedEvent: event }),
}));
