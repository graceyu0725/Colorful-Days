import {
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import clsx from 'clsx';
import { format } from 'date-fns';
import { useModalStore } from '../../store/modalStore';
import { themeColors } from '../../utils/theme';

export default function More() {
  const {
    isMoreModalOpen,
    setIsMoreModalOpen,
    setIsEditModalOpen,
    eventsToShow,
  } = useModalStore();
  const eventsToRender = eventsToShow.filter((event) => event !== null);

  return (
    <Modal
      isOpen={isMoreModalOpen}
      onOpenChange={(isOpen) => setIsMoreModalOpen(isOpen, eventsToRender)}
      size='xs'
      scrollBehavior='inside'
    >
      <ModalContent className='max-h-[calc(100vh_-_130px)]'>
        <ModalHeader className='py-3'>
          {eventsToRender.length} Events
        </ModalHeader>
        <Divider />
        <ModalBody className='gap-2 py-4 overflow-y-auto'>
          {eventsToRender.map(
            (event, index) =>
              event && (
                <div
                  key={index}
                  className={clsx(
                    'flex items-center justify-between shrink-0 truncate px-2 h-6 rounded hover:cursor-pointer hover:-translate-y-px hover:shadow-md',
                    event.isAllDay
                      ? `${
                          themeColors[Number(event.tag)].darkBackground
                        } text-white`
                      : 'bg-slate-100',
                  )}
                  onClick={() => {
                    setIsEditModalOpen(true, event);
                    setIsMoreModalOpen(false, eventsToRender);
                  }}
                >
                  {event.isAllDay ? (
                    <div className='truncate'>{event.title}</div>
                  ) : (
                    <>
                      <div className='flex w-3/4 h-full items-center gap-2'>
                        <div
                          className={clsx(
                            'w-1 h-2/3 shrink-0 rounded',
                            themeColors[Number(event.tag)].darkBackground,
                          )}
                        />
                        <div className='truncate'>{event.title}</div>
                      </div>

                      <div className='truncate mr-1 text-xs text-gray-400'>
                        {format(event.startAt || new Date(), 'h:mm a')}
                      </div>
                    </>
                  )}
                </div>
              ),
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
