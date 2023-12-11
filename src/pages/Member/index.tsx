import { motion } from 'framer-motion';
import { useState } from 'react';
import Signin from './Signin';
import Signup from './Signup';
import signinImage from './signinImage.png';

function Login() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className='flex items-center justify-center h-screen bg-theme-1-200'>
      <div className='w-11/12 h-5/6 flex overflow-hidden height-auto text-foreground box-border bg-content1 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium transition-transform-background motion-reduce:transition-none p-0 rounded-2xl z-10'>
        <motion.div
          className='mx-6 h-full w-1/3 relative flex flex-1 flex-col justify-center lg:flex-none'
          style={{ backfaceVisibility: 'hidden' }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        >
          <Signin isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
          <Signup isFlipped={isFlipped} setIsFlipped={setIsFlipped} />
        </motion.div>

        <div className='relative hidden w-0 flex-1 lg:block lg:grow lg:w-1/2'>
          <img
            className='absolute h-full w-full object-cover'
            src={signinImage}
            alt=''
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
