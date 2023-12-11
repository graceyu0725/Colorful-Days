import { Button, Image } from '@nextui-org/react';
// import { motion, useAnimation } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EosIconsLoading from '~icons/eos-icons/loading';
import LogosGoogleIcon from '~icons/logos/google-icon';
import { firebase } from '../../utils/firebase';
import { googleAuth } from '../../utils/googleAuth';
import { UserSignIn } from '../../utils/types';

type Props = {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signin: React.FC<Props> = ({ isFlipped, setIsFlipped }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      navigate('/calendar');
    }
  }, []);

  const [userInput, setUserInput] = useState<UserSignIn>({
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

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSignin = async () => {
    setIsButtonLoading(true);
    await firebase.signIn(userInput, navigate);
    setIsButtonLoading(false);
  };

  return (
    <motion.div
      className='absolute inset-0 flex flex-col justify-center mx-auto w-full max-w-sm'
      style={{ backfaceVisibility: 'hidden', perspective: '1000px' }}
      transition={{ duration: 0.5 }}
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
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

      <h2 className='mt-2 mb-4 text-3xl font-bold tracking-tight'>
        Sign in to your account
      </h2>

      <div className='mt-8'>
        <div
          className='flex gap-4 items-center justify-center h-11 w-full rounded-md bg-slate-100 py-3 px-4 shadow-sm hover:bg-slate-200 hover:cursor-pointer'
          onClick={async () => {
            setIsGoogleLoading(true);
            await googleAuth.signIn(navigate);
            setIsGoogleLoading(false);
          }}
        >
          {isGoogleLoading ? (
            <EosIconsLoading />
          ) : (
            <LogosGoogleIcon className='h-11' />
          )}
          <div className='font-medium'>Sign in with Google</div>
        </div>

        <div className='relative mt-6'>
          <div
            className='absolute inset-0 flex items-center'
            aria-hidden='true'
          >
            <div className='w-full border-t border-gray-300' />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='bg-white px-2 text-gray-500'>or</span>
          </div>
        </div>

        <div className='mt-6'>
          <form action='#' method='POST' className='space-y-6'>
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='email'
                className='block font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='email'
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
                id='password'
                name='password'
                type='password'
                autoComplete='current-password'
                required
                placeholder='At least 6 characters'
                value={userInput.password}
                onChange={updateUserInput}
                className='placeholder:h-11 placeholder:tracking-normal placeholder:text-sm tracking-widest h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
              />
            </div>

            <div className='flex items-center text-sm'>
              <div className='font-medium mr-2'>Don't have an account?</div>
              <div
                // to='/signup'
                className='font-medium text-slate-600 hover:text-theme-1-300 hover:cursor-pointer underline'
                onClick={() => setIsFlipped(true)}
              >
                Create account
              </div>
            </div>

            <div>
              <Button
                isLoading={isButtonLoading}
                type='button'
                disabled={!userInput.email || !userInput.password}
                onClick={handleSignin}
                className='h-11 w-full text-base rounded-lg bg-theme-1-300 text-white'
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Signin;
