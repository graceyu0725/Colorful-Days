import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router-dom';
import { CalendarInfo, UserSignIn, UserSignUp } from '../utils/types';
import { addUserForNative } from './handleUserAndCalendar';

const firebaseConfig = {
  apiKey: 'AIzaSyCH0cKRNrKHtRVIqk6vyMJEwI8gcsSW_vk',
  authDomain: 'colorful-days-dev.firebaseapp.com',
  projectId: 'colorful-days-dev',
  storageBucket: 'colorful-days-dev.appspot.com',
  messagingSenderId: '105839792711',
  appId: '1:105839792711:web:43e06f4fb81161f93e9762',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const firebase = {
  async signUp(
    userInfo: UserSignUp,
    navigate: NavigateFunction,
    calendarInfo: CalendarInfo,
  ) {
    try {
      const data = await createUserWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.password,
      );

      addUserForNative(userInfo, data.user.uid, calendarInfo);
      localStorage.setItem('uid', data.user.uid);
      navigate('/calendar');
    } catch (e: any) {
      if (e.message === 'Firebase: Error (auth/email-already-in-use).') {
        toast.error('此 Email 已被註冊');
        navigate('/signup');
      } else {
        toast.error('資料格式不正確，請再試一次');
        navigate('/signup');
      }
      localStorage.removeItem('uid');
    }
  },
  async signIn(userInfo: UserSignIn, navigate: NavigateFunction) {
    try {
      const data = await signInWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.password,
      );
      localStorage.setItem('uid', data.user.uid);
      navigate('/calendar');
    } catch (e) {
      toast.error('帳號或密碼錯誤');
      localStorage.removeItem('uid');
      console.error(e);
    }
  },
  logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        localStorage.removeItem('uid');
      })
      .catch((error) => {
        localStorage.removeItem('uid');
        console.error(error);
      });
  },
};
