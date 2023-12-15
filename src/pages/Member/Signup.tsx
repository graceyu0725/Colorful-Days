import { Button, Image } from '@nextui-org/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
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

  // const [userInput, setUserInput] = useState<UserSignUp>({
  //   name: '小丘',
  //   email: 'pikachu@gmail.com',
  //   password: '123456',
  // });

  // Update userInput when typing
  const updateUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'email' || name === 'password') {
      setUserInput((prevData) => ({
        ...prevData,
        [name]: value.trim(),
      }));
      return;
    }
    setUserInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+-=[\]{};':"\\|,.<>\/?]+$/g;
    return passwordRegex.test(password);
  };

  const handleSubmit = () => {
    if (userInput.name.replace(/\s+/g, '').length === 0) {
      toast.error('Name can not be empty!');
      return;
    }
    if (!isValidEmail(userInput.email)) {
      toast.error('Invalid email!');
      return;
    }
    if (userInput.password.length < 6) {
      toast.error('Password must contain at least 6 characters!');
      return;
    }
    if (!isValidPassword(userInput.password)) {
      toast.error('Password can only contain letters, numbers, and symbols!');
      return;
    }

    navigate('/select', {
      state: {
        userInfo: { ...userInput, name: userInput.name.trim() },
        isNativeSignup: true,
      },
    });
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

      <h2 className='mt-2 mb-6 text-3xl font-bold tracking-tight'>
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
                  handleSubmit();
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
                !userInput.name ||
                !userInput.email ||
                userInput.password.length < 6
              }
              onClick={handleSubmit}
              className={clsx(
                'h-11 w-full text-base rounded-lg bg-theme-1-300 text-white',
                {
                  ['pointer-events-none bg-theme-1-200 transition-colors']:
                    !userInput.name ||
                    !userInput.email ||
                    userInput.password.length < 6,
                },
              )}
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
