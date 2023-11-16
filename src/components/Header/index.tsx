import LucideAlignJustify from '~icons/lucide/align-justify';
import TdesignAdd from '~icons/tdesign/add';

function Header() {
  return (
    <>
      <nav className='border-b-3 sticky top-0 flex h-14 w-full items-center border border-slate-300 px-5 bg-slate-50'>
        <LucideAlignJustify className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer' />
        <img src='/assets/logo.png' className='w-10' />
        <h1 className='px-1 text-xl font-bold text-[#5a3a1b]'>Colorful Days</h1>
        <TdesignAdd className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer' />
      </nav>
    </>
  );
}

export default Header;
