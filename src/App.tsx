import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar';
import SelectTheme from './pages/Member/SelectTheme';
import Signin from './pages/Member/Signin';
import Signup from './pages/Member/Signup';
// import Test from './pages/Test';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <NextUIProvider>
        <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<Calendar />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/select' element={<SelectTheme />} />
          <Route path='/calendar' element={<Calendar />} />
          {/* <Route path='/test' element={<Test />} /> */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
