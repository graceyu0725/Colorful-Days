import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { NavigateFunction } from 'react-router-dom';
// import { updateCalendarContent } from '../store/authStore';
import { DocumentData, DocumentReference } from 'firebase/firestore/lite';
import {
  CalendarContent,
  CalendarInfo,
  GoogleUserInfo,
  User,
  UserSignUp,
  defaultTags,
} from '../utils/types';
import { db } from './firebase';

// 初始化時在 Calendar 集合中新增 events 子集合
export const addEventToCalendar = async (
  calendarDocRef: DocumentReference<DocumentData, { [x: string]: any }>,
) => {
  const eventsCollection = collection(calendarDocRef, 'events');
  const eventDocRef = doc(eventsCollection);

  await setDoc(eventDocRef, { placeholder: true });
};

export const addCalendar = async (
  userEmail: string,
  userName: string,
  userId: string,
  calendarName: string,
  selectedThemeColor: string,
  calendarDocRef: DocumentReference<DocumentData, { [x: string]: any }>,
) => {
  const newCalendar = {
    members: [{ email: userEmail, name: userName, id: userId }],
    name: calendarName,
    themeColor: selectedThemeColor,
    tags: defaultTags,
  };

  await setDoc(calendarDocRef, newCalendar);

  addEventToCalendar(calendarDocRef);
};

// Native sign-up
export const addUserForNative = async (
  userInfo: UserSignUp,
  uid: string,
  calendarInfo: CalendarInfo,
) => {
  const usersCollection = collection(db, 'Users');
  const docRef = doc(usersCollection, userInfo.email);
  const calendarsCollection = collection(db, 'Calendars');
  const calendarDocRef = doc(calendarsCollection);

  addCalendar(
    userInfo.email,
    userInfo.name,
    uid,
    calendarInfo.name,
    calendarInfo.themeColor,
    calendarDocRef,
  );

  const newUser = {
    userId: uid,
    name: userInfo.name,
    email: userInfo.email,
    avatar: '',
    calendars: [calendarDocRef.id],
  };
  await setDoc(docRef, newUser);
};

// Google sign-up
export const addUserForGoogle = async (
  userInfo: GoogleUserInfo,
  navigate: NavigateFunction,
  calendarInfo: CalendarInfo,
) => {
  if (userInfo.email) {
    const usersCollection = collection(db, 'Users');
    const docRef = doc(usersCollection, userInfo.email);
    const calendarsCollection = collection(db, 'Calendars');
    const calendarDocRef = doc(calendarsCollection);

    addCalendar(
      userInfo.email,
      userInfo.displayName || '',
      userInfo.uid,
      calendarInfo.name,
      calendarInfo.themeColor,
      calendarDocRef,
    );
    const newUser = {
      userId: userInfo.uid,
      name: userInfo.displayName,
      email: userInfo.email,
      avatar: userInfo.photoURL,
      calendars: [calendarDocRef.id],
    };
    await setDoc(docRef, newUser);
    alert('註冊成功');
    // updateCurrentUser(userInfo.uid,setCurrentUser);
    navigate('/calendar');
  }
};

export const isUserExists = async (userEmail: string) => {
  const usersCollection = collection(db, 'Users');
  const docRef = doc(usersCollection, userEmail);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return true;
  } else {
    return false;
  }
};

// 更新 calendar 狀態
const getCalendarContent = async (calendarId: string) => {
  try {
    console.log('4. 取得日曆內容');

    const calendarsCollection = collection(db, 'Calendars');
    const docRef = doc(calendarsCollection, calendarId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        members: docSnap.data()?.members,
        name: docSnap.data()?.name,
        tags: docSnap.data()?.tags,
        themeColor: docSnap.data()?.themeColor,
      };
    } else {
      console.error('No such document!');
    }
  } catch (error) {
    console.error('Error getting document:', error);
  }
};

const updateCalendarContent = async (
  calendarId: string,
  setCurrentCalendarId: (currentCalendarId: string) => void,
  setCurrentCalendarContent: (currentCalendarContent: CalendarContent) => void,
) => {
  const calendarContent = await getCalendarContent(calendarId);
  console.log('3. 更新日曆內容');
  // const { setCurrentCalendarId, setCurrentCalendarContent } = useAuthStore();
  if (calendarContent) {
    console.log('5. 設定日曆內容');
    setCurrentCalendarId(calendarId);
    setCurrentCalendarContent(calendarContent);
  }
};

// 初始化時更新 currentUser 的狀態
export const updateCurrentUser = async (
  uid: string,
  setCurrentUser: (currentUser: User) => void,
  setCurrentCalendarId: (currentCalendarId: string) => void,
  setCurrentCalendarContent: (currentCalendarContent: CalendarContent) => void,
) => {
  console.log('1. updateCurrentUser');
  // const { setCurrentUser, setCurrentCalendarId } = useAuthStore();

  console.log('2. 新增用戶');
  const q = query(collection(db, 'Users'), where('userId', '==', uid));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    setCurrentUser({
      userId: doc.data().userId,
      name: doc.data().name,
      email: doc.data().email,
      avatar: doc.data().avatar,
      calendars: doc.data().calendars,
    });

    // setCurrentCalendarId(doc.data().calendars[0]);
    updateCalendarContent(
      doc.data().calendars[0],
      setCurrentCalendarId,
      setCurrentCalendarContent,
    );
  });
};
