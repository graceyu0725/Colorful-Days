import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import toast from 'react-hot-toast';
import { NavigateFunction } from 'react-router-dom';
import { isUserExists } from './handleUserAndCalendar';

const provider = new GoogleAuthProvider();
const auth = getAuth();

export const googleAuth = {
  signIn: async (navigate: NavigateFunction) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      localStorage.setItem('uid', user.uid);

      if (user.email) {
        const userExists = await isUserExists(user.email);
        if (userExists) {
          toast.success('登入成功');
          localStorage.setItem('uid', user.uid);
          navigate('/calendar');
        } else {
          const userInfo = {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          };

          navigate('/select', {
            state: {
              userInfo: userInfo,
              isNativeSignup: false,
            },
          });
        }
      } else {
        localStorage.removeItem('uid');
        console.error('登入失敗');
      }
    } catch (error) {
      localStorage.removeItem('uid');
      console.error('登入失敗');
    }
  },
};
