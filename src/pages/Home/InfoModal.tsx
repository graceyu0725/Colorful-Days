import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import AdventCalendar from './img/advent-calendar.png';
import CollaborativePlanning from './img/collaborative-planning.gif';
import DND from './img/dnd.gif';
import EventManagement from './img/event-management.gif';
import ThemesImage from './img/theme-colors.gif';
import UserInterface from './img/user-interface.gif';

type Props = {
  isInfoModalOpen: boolean;
  setIsInfoModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedCell: null | number;
};

const InfoModal: React.FC<Props> = ({
  isInfoModalOpen,
  setIsInfoModalOpen,
  selectedCell,
}) => {
  type InfoType = {
    [key: number]: {
      title: string;
      content: string;
      image: string;
    };
  };

  const Info: InfoType = {
    1: {
      title: 'Christmas Advent Calendar',
      content:
        'Since Colorful Days is released in December, the landing page is designed with the concept of a Christmas Advent calendar.\r\nA Christmas Advent calendar is a festive countdown to Christmas Day, starting from December 1st and ending on Christmas Eve. Each day, a door or window is opened to reveal a small gift or treat, enhancing the holiday anticipation.\r\nThese calendars come in various styles and themes, often featuring chocolates, toys, or even small pieces of art, making them a cherished holiday tradition for families and individuals.',
      image: AdventCalendar,
    },
    5: {
      title: 'Drag and Drop Scheduling',
      content:
        'Users can change event dates by simply dragging and dropping them to the desired day. This feature streamlines the process of rescheduling, making calendar management more efficient and user-friendly!',
      image: DND,
    },
    7: {
      title: 'Multi-Color Themes',
      content:
        'Colorful Days offers a variety of theme color options, allowing users to tailor the layout design to their personal tastes and styles, which create a practical yet visually pleasing scheduling experience!',
      image: ThemesImage,
    },
    14: {
      title: 'Collaborative Planning',
      content:
        "Colorful Days supports multi-user collaboration, enabling team members to share calendars, schedule meetings, and update in real-time.\r\nWhether it's for family gatherings or corporate projects, Colorful Days makes teamwork effortless and efficient!",
      image: CollaborativePlanning,
    },
    18: {
      title: 'Intuitive User Interface',
      content:
        'With an intuitive and user-friendly interface, Colorful Days makes it easy for anyone to manage their schedules effectively.\r\nThe clean and clear layout ensures that users can quickly find what they need without any hassle.',
      image: UserInterface,
    },
    25: {
      title: 'Detailed Event Management',
      content:
        'Colorful Days goes beyond basic scheduling, offering detailed event management features.\r\nUsers can add notes and categorize events with tags, making it an all-encompassing tool for managing every aspect of their personal and professional lives.',
      image: EventManagement,
    },
  };

  return (
    <Modal
      isOpen={isInfoModalOpen}
      onOpenChange={(isOpen) => {
        setIsInfoModalOpen(isOpen);
      }}
      size='2xl'
    >
      <ModalContent className='max-h-[calc(100vh_-_130px)] overflow-y-auto'>
        <ModalHeader className='mt-3'>
          {selectedCell && (
            <div className='text-xl text-[#EC8F3F]'>
              {Info[selectedCell].title}
            </div>
          )}
        </ModalHeader>
        <ModalBody className='pb-6'>
          {selectedCell && (
            <div className='flex flex-col gap-4'>
              <img
                src={Info[selectedCell].image}
                alt={Info[selectedCell].title}
                className='h-80 rounded-xl border object-cover w-full bg-slate-200'
              />
              <div className=' whitespace-pre-line'>
                {Info[selectedCell].content}
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InfoModal;
