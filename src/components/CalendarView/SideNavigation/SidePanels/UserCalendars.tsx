import {
  Button,
  Card,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollShadow,
} from '@nextui-org/react';
import clsx from 'clsx';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import MaterialSymbolsAddBoxOutlineRounded from '~icons/material-symbols/add-box-outline-rounded';
import PhDotsThreeVerticalBold from '~icons/ph/dots-three-vertical-bold';
import UilSchedule from '~icons/uil/schedule';
import { useAuthStore } from '../../../../store/authStore';
import { useEventsStore } from '../../../../store/eventsStore';
import { useModalStore } from '../../../../store/modalStore';
import { db } from '../../../../utils/firebase';
import {
  deleteCalendar,
  updateCalendarContent,
  updateCurrentUser,
} from '../../../../utils/handleUserAndCalendar';
import { themeColors } from '../../../../utils/theme';
import {
  CalendarContent,
  defaultTags,
  initialCalendarContent,
} from '../../../../utils/types';

type Props = {
  currentCalendarId: string;
  calendarDetails: CalendarContent[];
};

const UserCalendars: React.FC<Props> = ({
  currentCalendarId,
  calendarDetails,
}) => {
  const {
    currentUser,
    setCurrentCalendarId,
    setCurrentCalendarContent,
    setCurrentUser,
    currentThemeColor,
  } = useAuthStore();
  const { setIsAddCalendarModalOpen } = useModalStore();
  const { setCalendarAllEvents } = useEventsStore();

  const [hoveredCalendar, setHoveredCalendar] = useState<CalendarContent>(
    initialCalendarContent,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isEditCalendarModalOpen, setIsEditCalendarModalOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(Array(8).fill(false));
  const [isNameValid, setIsNameValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleEditCalendar = () => {
    // 只有管理員可以刪除該行事曆
    if (currentUser.userId === hoveredCalendar.members[0]) {
      setIsEditCalendarModalOpen(true);
      setIsPopoverOpen(false);
      return;
    }
    toast.error('You are not allowed to edit this calendar!');
  };

  const handleSaveCalendar = async () => {
    setIsSaving(true);
    try {
      const calendarsCollection = collection(db, 'Calendars');
      const calendarDocRef = doc(
        calendarsCollection,
        hoveredCalendar.calendarId,
      );
      await setDoc(calendarDocRef, hoveredCalendar);
      setIsSaving(false);
      setIsEditCalendarModalOpen(false);
      toast.success('Calendar updated successfully');
    } catch {
      setIsSaving(false);
      setIsEditCalendarModalOpen(false);
      toast.error(
        'There is an error when updating calendar. Please try it again!',
      );
    }
  };

  const handleDeleteCalendar = async (calendarDetail: CalendarContent) => {
    setIsLoading(true);

    // 只有管理員可以刪除該行事曆
    if (currentUser.userId === calendarDetail.members[0]) {
      await deleteCalendar(calendarDetail);
      updateCurrentUser(
        currentUser.userId,
        setCurrentUser,
        setCurrentCalendarId,
        setCurrentCalendarContent,
      );
      setIsLoading(false);

      toast.success('Calendar removed successfully');
      return;
    }

    setIsLoading(false);
    toast.error('You are not allowed to delete this calendar!');

    setIsPopoverOpen(false);
  };

  useEffect(() => {
    let initialSelection = Array(8).fill(false);
    initialSelection.fill(
      true,
      Number(hoveredCalendar.themeColor),
      Number(hoveredCalendar.themeColor) + 1,
    );
    setIsSelected(initialSelection);
  }, [hoveredCalendar]);

  return (
    <div className='py-4 px-3 flex flex-col gap-3 overflow-y-auto'>
      <div
        className={clsx(
          'mb-2 shadow-md flex items-center justify-center gap-2 h-10 text-lg leading-10 bg-slate-200 rounded-xl outline outline-1 outline-offset-2 text-white transition',
          currentThemeColor.darkBackground,
          currentThemeColor.outline,
        )}
      >
        <UilSchedule />
        My Calendars
      </div>

      {calendarDetails.map((calendarDetail, index) => (
        <Card
          key={index}
          className={clsx(
            'h-12 shrink-0 rounded-xl shadow border hover:cursor-pointer text-center transform transition hover:scale-105',
            {
              [`outline hover:scale-100 border-none shadow-md ${currentThemeColor.outline}`]:
                calendarDetail.calendarId === currentCalendarId,
            },
          )}
          onMouseEnter={() => {
            setHoveredCalendar(calendarDetail);
          }}
          onMouseLeave={() => {
            setIsPopoverOpen(false);
          }}
        >
          <div
            className='flex items-center justify-between gap-2 w-full h-full p-3'
            onClick={() => {
              if (calendarDetail.calendarId !== currentCalendarId) {
                updateCalendarContent(
                  calendarDetail.calendarId,
                  setCurrentCalendarId,
                  setCurrentCalendarContent,
                  setCalendarAllEvents,
                );
              }
            }}
          >
            <div className='truncate'>
              <ScrollShadow
                hideScrollBar
                offset={0}
                orientation='horizontal'
                className='w-36 text-start'
              >
                {calendarDetail.name}
              </ScrollShadow>
            </div>

            {hoveredCalendar &&
              hoveredCalendar.calendarId === calendarDetail.calendarId &&
              calendarDetails.length > 1 && (
                <Popover
                  placement='bottom'
                  isOpen={isPopoverOpen}
                  onOpenChange={() => setIsPopoverOpen((isOpen) => !isOpen)}
                >
                  <PopoverTrigger className='border-none outline-none'>
                    <button>
                      <PhDotsThreeVerticalBold className='w-4 h-4 p-0' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='px-0 py-2 rounded-lg flex flex-col'>
                    <Button
                      color='default'
                      variant='bordered'
                      className='p-0 border-0 h-7 hover:bg-slate-100 rounded'
                      onClick={handleEditCalendar}
                    >
                      Edit
                    </Button>
                    <Button
                      isLoading={isLoading}
                      color='danger'
                      variant='bordered'
                      className='p-0 border-0 h-7 hover:bg-slate-100 rounded'
                      onClick={() => handleDeleteCalendar(calendarDetail)}
                    >
                      delete
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
          </div>
        </Card>
      ))}

      <Card className='shrink-0 h-12 rounded-xl shadow border hover:cursor-pointer flex-row items-center justify-center gap-2 transform transition hover:scale-105'>
        <div
          className='flex items-center justify-center gap-2 w-full h-full'
          onClick={() => {
            setIsAddCalendarModalOpen(true);
          }}
        >
          <MaterialSymbolsAddBoxOutlineRounded className='w-5 h-5 text-slate-400' />
          <div className='text-slate-400'>Add Calendar</div>
        </div>
      </Card>

      <Modal
        isOpen={isEditCalendarModalOpen}
        onOpenChange={(isOpen) => {
          setIsEditCalendarModalOpen(isOpen);
        }}
        size='2xl'
      >
        <ModalContent className='max-h-[calc(100vh_-_130px)]'>
          <ModalHeader>Edit Calendar</ModalHeader>
          <Divider />
          <ModalBody className='overflow-y-auto'>
            <div className='flex gap-4'>
              <div className='w-1/2 flex flex-col gap-8'>
                <div className='flex flex-col gap-2'>
                  <div className='text-lg'>Calendar Name</div>
                  <input
                    name='name'
                    className={clsx(
                      'border-2 w-11/12 h-12 leading-[48px] rounded-lg px-3 text-base focus:outline-none',
                      themeColors[Number(hoveredCalendar.themeColor)].border,
                    )}
                    value={hoveredCalendar.name}
                    onChange={(e) => {
                      if (e.target.value.length <= 30) {
                        setIsNameValid(true);
                        setHoveredCalendar({
                          ...hoveredCalendar,
                          name: e.target.value,
                        });
                        return;
                      }
                      setIsNameValid(false);
                    }}
                  />
                  {!isNameValid && (
                    <div className='text-sm text-red-500 -mt-1 -mb-6'>
                      Maximum length is 30 characters.
                    </div>
                  )}
                </div>
                <div className='flex flex-col gap-4'>
                  <div className='text-lg'>Theme Color</div>
                  <div className='flex gap-4 flex-wrap px-5'>
                    {themeColors.map((color, index) => (
                      <button
                        key={index}
                        className={clsx(
                          '-skew-x-12 w-12 h-36 rounded',
                          color.background,
                          {
                            ['outline outline-3 outline-offset-2 outline-slate-300']:
                              isSelected[index],
                          },
                        )}
                        name='themeColor'
                        value={index}
                        onClick={() => {
                          setIsSelected((prevState) =>
                            prevState.map((_, idx) =>
                              idx === index ? true : false,
                            ),
                          );
                          setHoveredCalendar({
                            ...hoveredCalendar,
                            themeColor: index.toString(),
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className='w-1/2 flex flex-col gap-2'>
                <div className='flex justify-between items-center'>
                  <div className='text-lg'>Tags</div>
                  <div
                    className='text-sm underline text-gray-500 hover:cursor-pointer hover:text-theme-1-300'
                    onClick={() =>
                      setHoveredCalendar({
                        ...hoveredCalendar,
                        tags: defaultTags,
                      })
                    }
                  >
                    reset to default
                  </div>
                </div>
                {hoveredCalendar.tags.map((tag, index) => (
                  <div key={index} className='flex items-center gap-3'>
                    <div
                      className={clsx(
                        'w-4 h-4 shrink-0 rounded-full',
                        themeColors[index].darkBackground,
                      )}
                    />
                    <Input
                      size='sm'
                      value={tag.name}
                      onChange={(e) => {
                        if (e.target.value.length <= 30) {
                          let newTags = [...hoveredCalendar.tags];
                          newTags[index] = {
                            ...newTags[index],
                            name: e.target.value,
                          };
                          setHoveredCalendar({
                            ...hoveredCalendar,
                            tags: newTags,
                          });
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>
          <Divider />
          <ModalFooter>
            <Button
              variant='bordered'
              className='w-1/2'
              onPress={() => setIsEditCalendarModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              isLoading={isSaving}
              className={clsx(
                'w-1/2 transition-colors text-white',
                themeColors[Number(hoveredCalendar.themeColor)].darkBackground,
              )}
              onPress={handleSaveCalendar}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserCalendars;
