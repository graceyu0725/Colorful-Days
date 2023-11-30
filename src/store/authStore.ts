import { create } from 'zustand';
import {
  CalendarContent,
  User,
  initialCalendarContent,
  initialUser,
} from '../utils/types';

interface authState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  currentUser: User;
  setCurrentUser: (currentUser: User) => void;
  currentCalendarId: string;
  setCurrentCalendarId: (currentCalendarId: string) => void;
  currentCalendarContent: CalendarContent;
  setCurrentCalendarContent: (currentCalendarContent: CalendarContent) => void;
  resetUser: () => void;
}

export const useAuthStore = create<authState>((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
  currentUser: initialUser,
  setCurrentUser: (currentUser) => set({ currentUser }),
  currentCalendarId: '',
  setCurrentCalendarId: (currentCalendarId) => set({ currentCalendarId }),
  currentCalendarContent: initialCalendarContent,
  setCurrentCalendarContent: (currentCalendarContent) =>
    set({ currentCalendarContent }),
  resetUser: () =>
    set({
      isLogin: false,
      currentUser: initialUser,
      currentCalendarId: '',
      currentCalendarContent: initialCalendarContent,
    }),
}));
