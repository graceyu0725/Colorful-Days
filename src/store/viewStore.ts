import { create } from 'zustand';

export enum CalendarViewCategory {
  Monthly = 'monthly',
  Weekly = 'weekly',
  List = 'list',
}

interface viewState {
  currentView: CalendarViewCategory;
  setCurrentView: (view: CalendarViewCategory) => void;
}

export const useViewStore = create<viewState>((set) => ({
  currentView: CalendarViewCategory.Monthly,
  setCurrentView: (view) => set({ currentView: view }),
}));
