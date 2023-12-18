import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Image } from '@nextui-org/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const validationSchema = z.object({
  name: z.string().trim().min(1, { message: 'Name is required' }),
  email: z.string().min(1, { message: 'Email is required' }).email({
    message: 'Must be a valid email',
  }),
  password: z
    .string()
    .trim()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type ValidationSchema = z.infer<typeof validationSchema>;
type Props = {
  isFlipped: boolean;
  setIsFlipped: React.Dispatch<React.SetStateAction<boolean>>;
};

const Signup: React.FC<Props> = ({ isFlipped, setIsFlipped }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    mode: 'onBlur',
    // defaultValues: {
    //   name: '小丘',
    //   email: 'pikachu@gmail.com',
    //   password: '123456',
    // },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('uid')) {
      navigate('/calendar');
    }
  }, []);

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    navigate('/select', {
      state: {
        userInfo: data,
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
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col'>
            <label
              htmlFor='userName'
              className='block font-medium text-gray-700'
            >
              Name
            </label>
            <input
              id='name'
              type='text'
              autoComplete='name'
              placeholder='Your name'
              className='placeholder:h-11 placeholder:text-sm leading-[44px] h-11 block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-theme-1-200 focus:outline-theme-1-200'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-sm text-red-500 mt-px -mb-2'>
                {errors.name?.message}
              </p>
            )}
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='email' className='block font-medium text-gray-700'>
              Email
            </label>
            <input
              id='signupEmail'
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
              id='signupPassword'
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
            <div className='font-medium mr-2'>Already have an account?</div>
            <div
              className='font-medium text-slate-600 hover:text-theme-1-300 hover:cursor-pointer underline'
              onClick={() => setIsFlipped(false)}
            >
              Sign in
            </div>
          </div>
          <div>
            <Button
              type='submit'
              className={clsx(
                'h-11 w-full text-base rounded-lg bg-theme-1-300 text-white',
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
