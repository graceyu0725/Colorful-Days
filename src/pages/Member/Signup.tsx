import { Button, Card, Image } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserSignUp } from '../../utils/types';
import signinImage from './signinImage.png';

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      navigate('/calendar');
    }
  }, []);

  const [userInput, setUserInput] = useState<UserSignUp>({
    name: 'Pikachu',
    email: 'pikachu@gmail.com',
    password: '123456',
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
    <>
      <div
        className='flex items-center justify-center h-screen bg-cover bg-theme-1-200'
        // style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-100/10 z-10' />

        <Card className='w-11/12 p-0 rounded-lg flex z-10 h-5/6'>
          <div className='flex h-full'>
            <div className='h-full flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
              <div className='max-h-full flex flex-col justify-center  mx-auto w-full max-w-sm lg:w-96'>
                <div className='flex items-end'>
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
                        value={userInput.name}
                        onChange={updateUserInput}
                        className='leading-[44px] h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
                      />
                    </div>
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
                        className='leading-[44px] h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
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
                        className='tracking-widest h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
                      />
                    </div>

                    <div className='flex items-center text-sm'>
                      <div className='font-medium mr-2'>
                        Already have an account?
                      </div>
                      <Link
                        to='/signin'
                        className='font-medium text-slate-600 hover:text-theme-1-300 underline'
                      >
                        Sign in
                      </Link>
                    </div>

                    <div>
                      <Button
                        type='button'
                        disabled={
                          !userInput.name ||
                          !userInput.email ||
                          !userInput.password
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
    </>
  );
}

export default Signup;
