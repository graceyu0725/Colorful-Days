import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar';
import Home from './pages/Home';
import Login from './pages/Member';
import SelectTheme from './pages/Member/SelectTheme';

function App() {
  return (
    <BrowserRouter>
      <NextUIProvider>
        <Toaster position='top-right' />
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
