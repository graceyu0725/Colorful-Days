import { Button, Image } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSignUp } from '../../utils/types';

type Props = {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signup: React.FC<Props> = ({ isFlipped, setIsFlipped }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      navigate('/calendar');
    }
  }, []);

  const [userInput, setUserInput] = useState<UserSignUp>({
    name: '',
    email: '',
    password: '',
  });

  // Update userInput when typing
  const updateUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <motion.div
      className='absolute inset-0 flex flex-col justify-center mx-auto w-full max-w-sm lg:w-96'
      style={{ backfaceVisibility: 'hidden', perspective: '1000px' }}
      transition={{ duration: 0.5 }}
      initial={{ opacity: 0 }}
      animate={{ rotateY: isFlipped ? 0 : -180, opacity: 1 }}
    >
      <div
        className='flex items-end hover:cursor-pointer max-w-fit'
        onClick={() => navigate('/')}
      >
        <Image
          className='h-10 mr-2'
          src='assets/logo.png'
          alt='Colorful Days'
        />
        <div className='font-custom text-3xl font-bold text-theme-1-300'>
          Colorful Days
        </div>
      </div>

      <h2 className='mt-2 mb-10 text-3xl font-bold tracking-tight'>
        Create your colorful days
      </h2>

      <div className='mt-6'>
        <form action='#' method='POST' className='space-y-6'>
          <div className='flex flex-col'>
            <label
              htmlFor='userName'
              className='block font-medium text-gray-700'
            >
              Name
            </label>
            <input
              id='name'
              name='name'
              type='text'
              autoComplete='name'
              required
              placeholder='Your name'
              value={userInput.name}
              onChange={updateUserInput}
              className='placeholder:h-11 placeholder:text-sm leading-[44px] h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='block font-medium text-gray-700'>
              Email
            </label>
            <input
              id='signupEmail'
              name='email'
              type='email'
              autoComplete='email'
              required
              placeholder='email@example.com'
              value={userInput.email}
              onChange={updateUserInput}
              className='placeholder:h-11 placeholder:text-sm leading-[44px] h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label
              htmlFor='password'
              className='block font-medium text-gray-700'
            >
              Password
            </label>
            <input
              id='signupPassword'
              name='password'
              type='password'
              autoComplete='current-password'
              required
              placeholder='At least 6 characters'
              value={userInput.password}
              onChange={updateUserInput}
              className='placeholder:h-11 placeholder:tracking-normal placeholder:text-sm tracking-widest h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  userInput.name &&
                  userInput.email &&
                  userInput.password
                ) {
                  navigate('/select', {
                    state: {
                      userInfo: userInput,
                      isNativeSignup: true,
                    },
                  });
                }
              }}
            />
          </div>

          <div className='flex items-center text-sm'>
            <div className='font-medium mr-2'>Already have an account?</div>
            <div
              // to='/signin'
              className='font-medium text-slate-600 hover:text-theme-1-300 hover:cursor-pointer underline'
              onClick={() => setIsFlipped(false)}
            >
              Sign in
            </div>
          </div>

          <div>
            <Button
              type='button'
              disabled={
                !userInput.name || !userInput.email || !userInput.password
              }
              onClick={() =>
                navigate('/select', {
                  state: {
                    userInfo: userInput,
                    isNativeSignup: true,
                  },
                })
              }
              className='h-11 w-full text-base rounded-lg bg-theme-1-300 text-white'
            >
              Create account
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Signup;
