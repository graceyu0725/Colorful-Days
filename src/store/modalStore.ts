import { create } from 'zustand';

interface ModalState {
  isCreateModalOpen: boolean;
  selectedDate: Date | null;
  setIsCreateModalOpen: (isOpen: boolean, date: Date | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateModalOpen: false,
  selectedDate: null,
  setIsCreateModalOpen: (isOpen, date) =>
    set({ isCreateModalOpen: isOpen, selectedDate: date }),
}));
