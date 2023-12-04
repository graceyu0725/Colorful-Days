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
import { arrayUnion, serverTimestamp, updateDoc } from 'firebase/firestore';
import { DocumentData, DocumentReference } from 'firebase/firestore/lite';
import {
  CalendarContent,
  CalendarInfo,
  Event,
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
  userId: string,
  calendarName: string,
  selectedThemeColor: string,
  calendarDocRef: DocumentReference<DocumentData, { [x: string]: any }>,
) => {
  const newCalendar = {
    members: [userId],
    name: calendarName,
    themeColor: selectedThemeColor,
    tags: defaultTags,
    calendarId: calendarDocRef.id,
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

  addCalendar(uid, calendarInfo.name, calendarInfo.themeColor, calendarDocRef);

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
        calendarId: docSnap.data()?.calendarId,
      };
    } else {
      console.error('No such document!');
    }
  } catch (error) {
    console.error('Error getting document:', error);
  }
};

export const updateCalendarContent = async (
  calendarId: string,
  setCurrentCalendarId: (currentCalendarId: string) => void,
  setCurrentCalendarContent: (currentCalendarContent: CalendarContent) => void,
) => {
  console.log('3. 更新日曆內容');
  const calendarContent = await getCalendarContent(calendarId);
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

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    setCurrentUser({
      userId: userData.userId,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar,
      calendars: userData.calendars,
    });

    if (userData.calendars && userData.calendars.length > 0) {
      updateCalendarContent(
        userData.calendars[0],
        setCurrentCalendarId,
        setCurrentCalendarContent,
      );
    }
  } else {
    console.error('No such user!');
  }
};

// For Side Navigation - Calendars
// 根據 Calendar Id 取得 Calendar Name
const getCalendarDetail = async (calendarId: string) => {
  const calendarsCollection = collection(db, 'Calendars');
  const docRef = doc(calendarsCollection, calendarId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.error('No such document!');
  }
};

export const getAllCalendarDetail = async (userCalendars: string[]) => {
  const promises = userCalendars.map((calendarId) =>
    getCalendarDetail(calendarId),
  );
  const userCalendarsDetail = await Promise.all(promises);
  return userCalendarsDetail as CalendarContent[];
};

export const createNewCalendar = async (
  userEmail: string,
  userId: string,
  calendarName: string,
  calendarThemeColor: string,
  setCurrentCalendarId: (currentCalendarId: string) => void,
  setCurrentCalendarContent: (currentCalendarContent: CalendarContent) => void,
  resetAllEvents: () => void,
) => {
  const calendarsCollection = collection(db, 'Calendars');
  const calendarDocRef = doc(calendarsCollection);
  addCalendar(userId, calendarName, calendarThemeColor, calendarDocRef);
  const userRef = doc(db, 'Users', userEmail);
  await updateDoc(userRef, {
    calendars: arrayUnion(calendarDocRef.id),
  });
  resetAllEvents();

  updateCalendarContent(
    calendarDocRef.id,
    setCurrentCalendarId,
    setCurrentCalendarContent,
  );
  console.log('新增日曆成功');
};

// For Side Navigation - Members
// 根據 Member Id 取得 Member Info
const getMemberDetailById = async (memberId: string) => {
  const q = query(collection(db, 'Users'), where('userId', '==', memberId));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  } else {
    console.error('No such document!');
  }
};

export const getAllMemberDetail = async (memberIds: string[]) => {
  const promises = memberIds.map((memberId) => getMemberDetailById(memberId));
  const userCalendarsDetail = await Promise.all(promises);
  return userCalendarsDetail as User[];
};

// 根據輸入的 email 搜尋該會員資料
export const getMemberSearchResults = async (memberEmail: string) => {
  const usersCollection = collection(db, 'Users');
  const docRef = doc(usersCollection, memberEmail);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  } else {
    return 'nonexistent';
  }
};

// Invite 後更新 Calendar's members & User's calendars
export const addMemberToCalendar = async (
  calendarId: string,
  memberId: string,
  memberEmail: string,
) => {
  try {
    // 根據 CalendarId，將 userId push 進 Calendar.members Array
    const calendarsCollection = collection(db, 'Calendars');
    const calendarDocRef = doc(calendarsCollection, calendarId);
    await updateDoc(calendarDocRef, {
      members: arrayUnion(memberId),
    });

    // 根據 UserId，將 CalendarId push 進 User.calendars Array
    const usersCollection = collection(db, 'Users');
    const userDocRef = doc(usersCollection, memberEmail);
    await updateDoc(userDocRef, {
      calendars: arrayUnion(calendarId),
    });
    return true;
  } catch (error) {
    console.error('Error adding member to calendar:', error);
    return false;
  }
};

// For Side Navigation - Memo
export const addNewMemo = async (
  tag: string,
  memoTitle: string,
  currentCalendarId: string,
) => {
  const currentTime = serverTimestamp();
  const eventsCollection = collection(
    db,
    'Calendars',
    currentCalendarId,
    'events',
  );
  const eventUUID = doc(eventsCollection).id;
  const calendarRef = doc(db, 'Calendars', currentCalendarId);
  const newEventRef = doc(calendarRef, 'events', eventUUID);

  const data = {
    title: memoTitle,
    tag: tag,
    startAt: new Date(),
    endAt: new Date(),
    createdAt: currentTime,
    updatedAt: currentTime,
    isAllDay: false,
    isMemo: true,
    note: '',
    messages: [],
    eventId: eventUUID,
  };

  await setDoc(newEventRef, data);
};

// For ViewEventModal - comments
export const addNewComment = async (
  calendarId: string,
  eventId: string,
  userInfo: User,
  comment: string,
) => {
  if (!comment) return;
  const eventDoc = doc(db, 'Calendars', calendarId, 'events', eventId);
  const newComment = {
    arthur: userInfo,
    content: comment,
    createdAt: new Date(),
  };
  await updateDoc(eventDoc, {
    messages: arrayUnion(newComment),
  });
};
