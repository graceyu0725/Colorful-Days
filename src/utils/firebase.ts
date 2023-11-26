import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
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
        addUser(userInfo, userCredential.user.uid);
        console.log('註冊user', userCredential.user);
        localStorage.setItem('uid', userCredential.user.uid);

        alert('註冊成功');
        navigate('/calendar');
      })
      .catch((error) => {
        if (error.message === 'Firebase: Error (auth/email-already-in-use).') {
          alert('此 Email 已被註冊');
        } else {
          alert('資料格式不正確，請再試一次');
        }
        localStorage.removeItem('uid');
      });
  },
  signIn(userInfo: UserSignIn, navigate: NavigateFunction) {
    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        localStorage.setItem('uid', userCredential.user.uid);
        alert('登入成功');
        navigate('/calendar');
      })
      .catch((error) => {
        alert('帳號或密碼錯誤');
        localStorage.removeItem('uid');
      });
  },
  logOut() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        localStorage.removeItem('uid');
      });
  },
};
