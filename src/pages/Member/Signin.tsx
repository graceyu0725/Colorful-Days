import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Image } from '@nextui-org/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import EosIconsLoading from '~icons/eos-icons/loading';
import LogosGoogleIcon from '~icons/logos/google-icon';
import { firebase } from '../../utils/firebase';
import { googleAuth } from '../../utils/googleAuth';

const validationSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email({
    message: 'Must be a valid email',
  }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;
type Props = {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signin: React.FC<Props> = ({ isFlipped, setIsFlipped }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
  });
  const navigate = useNavigate();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    setIsButtonLoading(true);
    await firebase.signIn(data, navigate);
    setIsButtonLoading(false);
  };

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      navigate('/calendar');
    }
  }, []);

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

      <h2 className='mt-2 mb-2 text-3xl font-bold tracking-tight'>
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

        <div className='relative mt-4'>
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

        <div className='mt-2'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col gap-1'>
              <label
                htmlFor='email'
                className='block font-medium text-gray-700'
              >
                Email
              </label>
              <input
                id='signinEmail'
                autoComplete='email'
                placeholder='email@example.com'
                className='placeholder:h-11 placeholder:text-sm leading-[44px] h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-sm text-red-500 mt-px -mb-2'>
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-1'>
              <label
                htmlFor='password'
                className='block font-medium text-gray-700'
              >
                Password
              </label>
              <input
                id='signinPassword'
                type='password'
                autoComplete='current-password'
                placeholder='At least 6 characters'
                className='placeholder:h-11 placeholder:tracking-normal placeholder:text-sm tracking-widest h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(onSubmit);
                  }
                }}
                {...register('password')}
              />
              {errors.password && (
                <p className='text-sm text-red-500 mt-px -mb-2'>
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className='flex items-center text-sm'>
              <div className='font-medium mr-2'>Don't have an account?</div>
              <div
                className='font-medium text-slate-600 hover:text-theme-1-300 hover:cursor-pointer underline'
                onClick={() => setIsFlipped(true)}
              >
                Create account
              </div>
            </div>

            <div>
              <Button
                isLoading={isButtonLoading}
                type='submit'
                className={clsx(
                  'h-11 w-full text-base rounded-lg bg-theme-1-300 text-white',
                )}
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
