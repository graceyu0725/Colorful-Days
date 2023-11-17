import { create } from 'zustand';

interface ModalState {
  isCreateModalOpen: boolean;
  selectedDate: Date | null;
  setModalOpen: (isOpen: boolean, date: Date | null) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isCreateModalOpen: false,
  selectedDate: null,
  setModalOpen: (isOpen, date) =>
    set({ isCreateModalOpen: isOpen, selectedDate: date }),
}));
