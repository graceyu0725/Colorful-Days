import { create } from 'zustand';
import { User, initialUser } from '../utils/types';

interface authState {
  isLogin: boolean;
  setIsLogin: (isLogin: boolean) => void;
  currentUser: User;
  setCurrentUser: (currentUser: User) => void;
}

export const useAuthStore = create<authState>((set) => ({
  isLogin: false,
  setIsLogin: (isLogin) => set({ isLogin }),
  currentUser: initialUser,
  setCurrentUser: (currentUser) => set({ currentUser }),
}));
