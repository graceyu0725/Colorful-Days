import LucideAlignJustify from '~icons/lucide/align-justify';
import User from '~icons/streamline/interface-user-circle-circle-geometric-human-person-single-user';
import TdesignAdd from '~icons/tdesign/add';
import { useModalStore } from '../../store/modalStore';

function Header() {
  const { isCreateModalOpen, setModalOpen } = useModalStore();
  const date: Date = new Date();

  console.log('isCreateModalOpen', isCreateModalOpen);
  return (
    <>
      <nav className='border-b-3 sticky top-0 flex justify-between h-14 w-full items-center border border-slate-300 px-5 bg-slate-50'>
        <div className='flex items-center'>
          <LucideAlignJustify className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer' />
          <img src='/assets/logo.png' className='w-10' />
          <h1 className='px-1 text-xl font-bold text-[#5a3a1b]'>
            Colorful Days
          </h1>
        </div>
        <div className='flex items-center'>
          <TdesignAdd
            onClick={() => setModalOpen(true, date)}
            className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer'
          />
          <User className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer' />
        </div>
      </nav>
    </>
  );
}

export default Header;
