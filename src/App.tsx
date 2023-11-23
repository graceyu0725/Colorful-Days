import { NextUIProvider } from '@nextui-org/react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Calendar from './pages/Calendar';

function App() {
  return (
    <BrowserRouter>
      <NextUIProvider>
        <Routes>
          <Route path='/' element={<Calendar />} />
          <Route path='/calendar' element={<Calendar />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </NextUIProvider>
    </BrowserRouter>
  );
}

export default App;
