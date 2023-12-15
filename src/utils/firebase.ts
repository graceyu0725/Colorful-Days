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

export const app = initializeApp(firebaseConfig);
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
      if (e instanceof Error) {
        if (e.message.includes('auth/email-already-in-use')) {
          toast.error('This email has already been registered!');
          navigate('/signin');
          localStorage.removeItem('uid');
          return;
        }
        toast.error('The data format is incorrect, please try again!');
        console.error(e.message);
        localStorage.removeItem('uid');
        throw new Error(e.message);
      } else {
        toast.error('An unknown error occurred, please try again!');
        console.error('An unknown error occurred');
        localStorage.removeItem('uid');
        throw new Error('An unknown error occurred');
      }
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
      toast.error('Incorrect username or password!');
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
    document.title = 'Colorful Days';
  },
};
