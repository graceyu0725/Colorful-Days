import { Card, Image } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogosGoogleIcon from '~icons/logos/google-icon';
import { useAuthStore } from '../../store/authStore';
import { firebase } from '../../utils/firebase';
import { googleAuth } from '../../utils/googleAuth';
import { UserSignIn } from '../../utils/types';
import signinImage from './signinImage.png';

function Signin() {
  const navigate = useNavigate();
  const { currentCalendarId } = useAuthStore();

  console.log('currentCalendarId', currentCalendarId);
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

  return (
    <div
      className='flex items-center justify-center h-screen bg-cover bg-slate-200'
      // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-100/50 z-10' />

      <Card className='w-11/12 p-0 rounded-none flex z-10 h-5/6'>
        <div className='flex h-full'>
          <div className='h-full flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='max-h-full flex flex-col justify-center  mx-auto w-full max-w-sm lg:w-96'>
              <div className='flex items-center'>
                <Image
                  className='h-10 mr-1'
                  src='assets/logo.png'
                  alt='Colorful Days'
                />
                <div className='text-xl font-bold text-[#5a3a1b]'>
                  Colorful Days
                </div>
              </div>

              <h2 className='mt-2 mb-4 text-3xl font-bold tracking-tight text-gray-900'>
                Sign in to your account
              </h2>

              <div className='mt-8'>
                <div
                  className='flex gap-4 items-center justify-center h-11 w-full rounded-md bg-slate-100 py-3 px-4 shadow-sm hover:bg-slate-200 hover:cursor-pointer'
                  onClick={() => googleAuth.signIn(navigate)}
                >
                  <LogosGoogleIcon className='h-11' />
                  <div className='font-medium text-gray-900'>
                    Sign in with Google
                  </div>
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
                        value={userInput.email}
                        onChange={updateUserInput}
                        className='h-11 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-slate-400'
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
                        value={userInput.password}
                        onChange={updateUserInput}
                        className='tracking-widest h-11 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-slate-400'
                      />
                    </div>

                    <div className='flex items-center text-sm'>
                      <div className='font-medium mr-2'>
                        Don't have an account?
                      </div>
                      <Link
                        to='/signup'
                        className='font-medium text-slate-600 hover:text-slate-500 underline'
                      >
                        Create account
                      </Link>
                    </div>

                    <div>
                      <button
                        type='button'
                        disabled={!userInput.email || !userInput.password}
                        onClick={() => firebase.signIn(userInput, navigate)}
                        className='h-11 flex w-full justify-center rounded-md border border-transparent disabled:bg-slate-500 bg-slate-700 py-2 px-4 font-medium text-white shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2'
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className='relative hidden w-0 flex-1 lg:block lg:grow'>
            <img
              className='absolute h-full w-full object-cover'
              src={signinImage}
              alt=''
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Signin;
