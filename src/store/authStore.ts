import { create } from 'zustand';
import { themeColors } from '../utils/theme';
import {
  CalendarContent,
  User,
  initialCalendarContent,
  initialUser,
} from '../utils/types';

interface themeColor {
  lightBackground: string;
  background: string;
  darkBackground: string;
  lightBorder: string;
  border: string;
  text: string;
  hover: string;
  outline: string;
}

interface authState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  currentUser: User;
  setCurrentUser: (currentUser: User) => void;
  currentCalendarId: string;
  setCurrentCalendarId: (currentCalendarId: string) => void;
  currentCalendarContent: CalendarContent;
  setCurrentCalendarContent: (currentCalendarContent: CalendarContent) => void;
  currentThemeColor: themeColor;
  setCurrentThemeColor: (color: themeColor) => void;
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
  currentThemeColor: themeColors[0],
  setCurrentThemeColor: (color) => set({ currentThemeColor: color }),
  resetUser: () =>
    set({
      isLogin: false,
      currentUser: initialUser,
      currentCalendarId: '',
      currentCalendarContent: initialCalendarContent,
      currentThemeColor: themeColors[0],
    }),
}));
