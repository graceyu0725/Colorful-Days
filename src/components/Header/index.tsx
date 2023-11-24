import LucideAlignJustify from '~icons/lucide/align-justify';
import User from '~icons/streamline/interface-user-circle-circle-geometric-human-person-single-user';
import TdesignAdd from '~icons/tdesign/add';
import { useModalStore } from '../../store/modalStore';

function Header() {
  const { setIsCreateModalOpen } = useModalStore();

  return (
    <div className='right-0 w-14 h-screen flex flex-col bg-slate-100'>
      {/* <nav className='border-b-3 sticky top-0 flex justify-between h-14 w-full items-center border border-slate-300 px-5 bg-slate-50 z-10'> */}
      <div className='flex items-center flex-col'>
        <User className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer' />
        <div>Memo</div>
        <div>Member</div>
        <div>Setting</div>
      </div>
      <div className='flex items-center flex-col'>
        <TdesignAdd
          onClick={() => setIsCreateModalOpen(true, new Date(), new Date())}
          className='mr-5 text-xl text-[#5a3a1b] hover:cursor-pointer'
        />
      </div>
      {/* </nav> */}
    </div>
  );
}

export default Header;
