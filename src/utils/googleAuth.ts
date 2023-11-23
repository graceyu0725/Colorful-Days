import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { NavigateFunction } from 'react-router-dom';
import { db } from './firebase';

const provider = new GoogleAuthProvider();
const auth = getAuth();

const addUser = async (userInfo) => {
  const usersCollection = collection(db, 'Users');
  const docRef = doc(usersCollection, userInfo.email);
  const newUser = {
    userId: userInfo.uid,
    name: userInfo.displayName,
    email: userInfo.email,
    avatar: userInfo.photoURL,
    calendars: [],
  };
  await setDoc(docRef, newUser);
};

export const googleAuth = {
  signIn(navigate: NavigateFunction) {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        localStorage.setItem('accessTokenFromGoogle', user.accessToken);
        console.log(user);
        // Add user info to Firestore
        addUser(user);

        navigate('/calendar');
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  },
};
