import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { NavigateFunction } from 'react-router-dom';
import { db } from './firebase';

const provider = new GoogleAuthProvider();
const auth = getAuth();

interface UserInfo {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

const addUser = async (userInfo: UserInfo) => {
  const usersCollection = collection(db, 'Users');

  if (userInfo.email) {
    const docRef = doc(usersCollection, userInfo.email);

    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      const newUser = {
        userId: userInfo.uid,
        name: userInfo.displayName,
        email: userInfo.email,
        avatar: userInfo.photoURL,
        calendars: [],
      };
      console.log('新google用戶');
      await setDoc(docRef, newUser);
    }
  }
};

export const googleAuth = {
  signIn(navigate: NavigateFunction) {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        localStorage.setItem('uid', result.user.uid);
        const userInfo = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        };
        addUser(userInfo);
        alert('登入成功');
        navigate('/calendar');
      })
      .catch((error) => {
        localStorage.removeItem('uid');
      });
  },
};
