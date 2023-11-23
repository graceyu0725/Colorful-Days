import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import { NavigateFunction } from 'react-router-dom';

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

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface UserSignIn {
  email: string;
  password: string;
}

const addUser = async (userInfo: UserSignUp, uid: string) => {
  const usersCollection = collection(db, 'Users');
  const docRef = doc(usersCollection, userInfo.email);
  const newUser = {
    userId: uid,
    name: userInfo.name,
    email: userInfo.email,
    avatar: '',
    calendars: [],
  };
  await setDoc(docRef, newUser);
};

export const firebase = {
  signUp(userInfo: UserSignUp, navigate: NavigateFunction) {
    console.log('註冊');
    createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        addUser(userInfo, user.uid);
        alert('註冊成功，請繼續登入');
        navigate('/signin');
      })
      .catch((error) => {
        alert('已註冊或資料格式不正確');
      });
  },
  signIn(userInfo: UserSignIn, navigate: NavigateFunction) {
    // setIsLoading(true);
    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem('accessToken', user.accessToken);
        alert('登入成功');
        // setIsLoading(false);
        navigate('/calendar');
      })
      .catch((error) => {
        // setIsLoading(false);
        alert('帳號或密碼錯誤');
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  },
};
