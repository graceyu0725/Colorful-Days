import { format } from 'date-fns';
import { create } from 'zustand';

export enum CalendarViewCategory {
  Monthly = 'monthly',
  Weekly = 'weekly',
  List = 'list',
}

interface viewState {
  currentView: CalendarViewCategory;
  setCurrentView: (view: CalendarViewCategory) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  formateDate: string;
}

export const useViewStore = create<viewState>((set) => ({
  currentView: CalendarViewCategory.Monthly,
  setCurrentView: (view) => set({ currentView: view }),
  currentDate: new Date(),
  formateDate: format(new Date(), 'MMMM, yyyy'),
  setCurrentDate: (date) =>
    set({ currentDate: date, formateDate: format(date, 'MMMM, yyyy') }),
}));
