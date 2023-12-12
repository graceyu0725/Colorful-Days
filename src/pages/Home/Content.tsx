import { Button } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Content() {
  const navigate = useNavigate();

  const phrases = [
    'Dynamic Scheduling',
    'Custom Themes',
    'Shared Calendars',
    'Your Style',
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [phrases.length]);

  return (
    <div className='flex flex-col justify-center items-center pl-20 w-1/2 h-[calc(100vh_-_64px)] mt-16'>
      <div className='flex flex-col gap-2 2xl:gap-3'>
        <div className='text-5xl text-gray-700 2xl:text-6xl'>Organize your days</div>
        <div className='text-5xl text-gray-700 2xl:text-6xl'>with a splash of color in</div>
        <div className='flip overflow-hidden h-16 relative 2xl:h-20'>
          {phrases.map((phrase, index) => (
            <span
              key={index}
              className={`h-16 text-5xl text-[#EC8F3F] font-bold absolute block duration-100  2xl:leading-[60px] 2xl:text-6xl ${
                index === activeIndex ? 'animate-push-in' : 'animate-push-out'
              }`}
            >
              {phrase}
            </span>
          ))}
        </div>

        <div className='w-4/5 text-lg text-gray-600 2xl:text-xl'>
          Colorful Days is your personalized web calendar for vibrant scheduling
          and seamless collaboration.
        </div>

        <Button
          variant='bordered'
          className='mt-8 text-lg w-40 h-12 bg-theme-1-300 border-none text-white 2xl:text-xl 2xl:w-44 2xl:h-14'
          onPress={() => navigate('/signin')}
        >
          START NOW
        </Button>
      </div>
    </div>
  );
}
