import { Card, Image } from '@nextui-org/react';
import backgroundImage from './background.png';
import signinImage from './signinImage.jpg';

function Signup() {
  return (
    <div
      className='flex items-center justify-center h-screen bg-cover'
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          zIndex: 1,
        }}
      ></div>

      <Card className='w-11/12 p-0 rounded-none flex z-10 h-5/6'>
        <div className='flex min-h-full'>
          <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
            <div className='mx-auto w-full max-w-sm lg:w-96'>
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

              <h2 className='mt-6 mb-10 text-3xl font-bold tracking-tight text-gray-900'>
                Create your colorful days
              </h2>

              <div className='mt-6'>
                <form action='#' method='POST' className='space-y-4'>
                  <div className='flex flex-col gap-1'>
                    <label
                      htmlFor='userName'
                      className='block font-medium text-gray-700'
                    >
                      Username
                    </label>
                    <input
                      id='username'
                      name='username'
                      type='text'
                      autoComplete='username'
                      required
                      className='h-11 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-slate-400'
                    />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label
                      htmlFor='email'
                      className='block font-medium text-gray-700'
                    >
                      Email address
                    </label>
                    <input
                      id='email'
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
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
                      className='h-11 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-slate-400'
                    />
                  </div>

                  <div>
                    <button
                      type='submit'
                      className='mt-12 h-11 flex w-full justify-center rounded-md border border-transparent bg-slate-700 py-2 px-4 font-medium text-white shadow-sm hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2'
                    >
                      Create account
                    </button>
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
  );
}

export default Signup;
