import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { firebase } from '../../utils/firebase';
import { themeColors } from '../../utils/theme';
import { CalendarContent, defaultTags } from '../../utils/types';

type Props = {
  isEditCalendarModalOpen: boolean;
  setIsEditCalendarModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  hoveredCalendar: CalendarContent;
  setHoveredCalendar: React.Dispatch<React.SetStateAction<CalendarContent>>;
};

const EditCalendar: React.FC<Props> = ({
  isEditCalendarModalOpen,
  setIsEditCalendarModalOpen,
  hoveredCalendar,
  setHoveredCalendar,
}) => {
  const [isNameValid, setIsNameValid] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSelected, setIsSelected] = useState(Array(8).fill(false));

  useEffect(() => {
    let initialSelection = Array(8).fill(false);
    initialSelection.fill(
      true,
      Number(hoveredCalendar.themeColor),
      Number(hoveredCalendar.themeColor) + 1,
    );
    setIsSelected(initialSelection);
  }, [hoveredCalendar]);

  const handleSaveCalendar = async () => {
    await firebase.updateCalendarInfo(hoveredCalendar, setIsSaving);
    setIsEditCalendarModalOpen(false);
  };

  const renderName = () => {
    return (
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
    );
  };

  const renderThemeColor = () => {
    return (
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
                  prevState.map((_, idx) => (idx === index ? true : false)),
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
    );
  };

  const renderTags = () => {
    const handleChangeTagName = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number,
    ) => {
      if (e.target.value.length > 30) return;
      let newTags = [...hoveredCalendar.tags];
      newTags[index] = {
        ...newTags[index],
        name: e.target.value,
      };
      setHoveredCalendar({
        ...hoveredCalendar,
        tags: newTags,
      });
    };

    return (
      <>
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
              onChange={(e) => handleChangeTagName(e, index)}
            />
          </div>
        ))}
      </>
    );
  };

  return (
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
              {renderName()}
              {renderThemeColor()}
            </div>
            <div className='w-1/2 flex flex-col gap-2'>{renderTags()}</div>
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
  );
};

export default EditCalendar;
