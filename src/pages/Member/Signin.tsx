import { Button, Card, Image } from '@nextui-org/react';
// import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EosIconsLoading from '~icons/eos-icons/loading';
import LogosGoogleIcon from '~icons/logos/google-icon';
import { firebase } from '../../utils/firebase';
import { googleAuth } from '../../utils/googleAuth';
import { UserSignIn } from '../../utils/types';
import signinImage from './signinImage.png';

function Signin() {
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

  // const [strokeColor, setStrokeColor] = useState('#b86b43');
  // const colors = ['#ec8f3f', '#8d6b61', '#798233', '#586d80', '#aa7d53'];
  // const controls = useAnimation();

  // useEffect(() => {
  //   let i = 0;
  //   const changeColor = () => {
  //     setStrokeColor(colors[i % colors.length]);
  //     i++;
  //   };

  //   const interval = setInterval(changeColor, 4000); // 變更顏色的時間間隔，這裡設為2000毫秒
  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   controls.start({ stroke: strokeColor });
  // }, [strokeColor, controls]);

  // const icon = {
  //   hidden: {
  //     pathLength: 0,
  //     fill: '#fff',
  //   },
  //   visible: {
  //     pathLength: 1,
  //     fill: '#fff',
  //   },
  // };

  return (
    <div
      className='flex items-center justify-center h-screen bg-cover bg-theme-1-200'
      // style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className='absolute top-0 left-0 right-0 bottom-0 bg-gray-100/10 z-10' />

      <Card className='w-11/12 p-0 rounded-lg flex z-10 h-5/6'>
        <div className='flex h-full'>
          <div className='h-full flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='max-h-full flex flex-col justify-center mx-auto w-full max-w-sm lg:w-96'>
              <div className='flex items-end'>
                <Image
                  className='h-10 mr-2'
                  src='assets/logo.png'
                  alt='Colorful Days'
                />
                {/* <motion.svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='w-8 h-8 mr-1'
                  viewBox='0 0 24 24'
                >
                  <motion.path
                    fill='none'
                    d='M17 10H7v2h10v-2zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5H7v2h7v-2z'
                    variants={icon}
                    animate='visible'
                    initial='hidden'
                    transition={{
                      duration: 4,
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatType: 'loop',
                      repeatDelay: 0,
                    }}
                    stroke={strokeColor}
                    stroke-width='6'
                    // stroke-dasharray='4 4' // 定義虛線段落和間隔的長度
                    stroke-dashoffset='2' // 定義虛線開始的偏移量
                  />
                </motion.svg> */}
                <div className='font-custom text-3xl font-bold text-theme-1-300'>
                  Colorful Days
                </div>

                {/* <svg
                  xmlns='assets/logo.png'
                  viewBox='0 0 100 100'
                  className='w-10 h-10'
                >
                  <motion.path
                    d='M0 100V0l50 50 50-50v100L75 75l-25 25-25-25z'
                    variants={icon}
                    initial='hidden'
                    animate='visible'
                  />
                </svg> */}
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
                      <div className='font-medium mr-2'>
                        Don't have an account?
                      </div>
                      <Link
                        to='/signup'
                        className='font-medium text-slate-600 hover:text-theme-1-300 underline'
                      >
                        Create account
                      </Link>
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
