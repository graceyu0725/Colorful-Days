import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Home from './pages/Home';
import Login from './pages/Member';
import SelectTheme from './pages/Member/SelectTheme';
import { useAuthStore } from './store/authStore';

const toastColors = [
  '#987970',
  '#577BAD',
  '#758467',
  '#DD8A62',
  '#9D91A7',
  '#8FBBC1',
  '#E7B752',
  '#D98481',
];

function App() {
  const { currentCalendarContent } = useAuthStore();

  return (
    <BrowserRouter>
      <NextUIProvider>
        <Toaster
          position='top-right'
          toastOptions={{
            style: {
              border: `1px solid ${
                toastColors[Number(currentCalendarContent.themeColor)]
              }`,
              padding: '8px',
              color: toastColors[Number(currentCalendarContent.themeColor)],
            },
            iconTheme: {
              primary: toastColors[Number(currentCalendarContent.themeColor)],
              secondary: '#FFFAEE',
            },
          }}
        />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/signin' element={<Login />} />
          <Route path='/select' element={<SelectTheme />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
