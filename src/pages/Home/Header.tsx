export default function Header() {
  return (
    <div className='absolute w-full h-16 flex justify-between items-center border-b border-theme-1-100 z-20'>
      <div className='flex items-end pl-20 z-20'>
        <img src='/assets/logo.png' className='w-9' />
        <h1 className='font-custom font-bold px-1 text-2xl mr-4 text-theme-1-300'>
          Colorful Days
        </h1>
      </div>
    </div>
  );
}
