import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import clsx from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';
import EosIconsLoading from '~icons/eos-icons/loading';
import IcRoundSearch from '~icons/ic/round-search';
import IcRoundSearchOff from '~icons/ic/round-search-off';
import IcSharpPersonSearch from '~icons/ic/sharp-person-search';
import MaterialSymbolsLightPersonAddRounded from '~icons/material-symbols-light/person-add-rounded';
import MaterialSymbolsPersonRemoveRounded from '~icons/material-symbols/person-remove-rounded';
import OcticonPeople16 from '~icons/octicon/people-16';
import { useAuthStore } from '../../../../store/authStore';
import {
  addMemberToCalendar,
  getMemberSearchResults,
  removeMember,
} from '../../../../utils/handleUserAndCalendar';
import { User } from '../../../../utils/types';
import AvatarImage from '../img/avatar.png';

type Props = {
  memberDetails: User[];
  setMemberDetails: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserCalendars: React.FC<Props> = ({ memberDetails }) => {
  const {
    currentUser,
    currentCalendarId,
    currentCalendarContent,
    currentThemeColor,
  } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<User | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMemberExist, setIsMemberExist] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value.replace(/\s+/g, '');
    setSearchInput(updatedValue);
    setSearchResult(null);
    setIsMemberExist(false);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const result = await getMemberSearchResults(searchInput);

    if (result && typeof result !== 'string') {
      setSearchResult(result);
      if (currentCalendarContent.members.includes(result.userId)) {
        setIsMemberExist(true);
      }
    } else if (result && typeof result == 'string') {
      setSearchResult(result);
    }

    setIsLoading(false);
  };

  const handleAddMember = async (result: User) => {
    setIsInviting(true);
    const isSuccess = await addMemberToCalendar(
      currentCalendarId,
      result.userId,
      result.email,
    );
    if (isSuccess) {
      setSearchInput('');
      setSearchResult(null);
      setIsMemberExist(false);
      setIsInviting(false);
      toast.success('Member added successfully');
    } else {
      toast.error('Failed to add member!');
    }
  };

  const handleRemoveMember = async (calendarId: string, userId: string) => {
    setIsDeleting(true);
    await removeMember(calendarId, userId);
    setIsDeleting(false);
    toast.success('Member removed successfully');
  };

  interface UserAvatarProps {
    avatarUrl: string | undefined;
  }
  const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl }) => (
    <img
      className='w-10 h-10 mr-2 rounded-full object-cover object-center'
      src={avatarUrl || AvatarImage}
    />
  );

  interface InviteButtonProps {
    isMemberExist: boolean;
    result: User;
  }
  const InviteButton: React.FC<InviteButtonProps> = ({
    isMemberExist,
    result,
  }) => (
    <Button
      isLoading={isInviting}
      disabled={isMemberExist}
      className={clsx(
        'mt-2 h-6 w-full px-2 rounded-md bg-slate-200 flex gap-1 items-center justify-center',
        currentThemeColor.lightBackground,
      )}
      onClick={() => handleAddMember(result)}
    >
      {isMemberExist ? (
        <div className='text-xs truncate'>Already a member</div>
      ) : (
        <>
          <MaterialSymbolsLightPersonAddRounded className='w-5 h-5' />
          <div className='text-xs truncate'>Invite {result.name}</div>
        </>
      )}
    </Button>
  );

  const renderSearchResult = (result: User, index: number, type: string) => {
    // 管理員可以移除他人但不能移除自己，成員僅能移除自己
    const shouldShowRemoveButton = () => {
      if (type === 'list') {
        if (currentUser.userId === currentCalendarContent.members[0]) {
          return result.userId === currentUser.userId ? false : true;
        } else {
          return result.userId === currentUser.userId ? true : false;
        }
      }
      return false;
    };
    const showRemoveButton = shouldShowRemoveButton();

    return (
      <div
        key={index}
        className={clsx('flex flex-col justify-center', {
          'h-20': type === 'invite',
        })}
      >
        <div className='flex items-center'>
          <UserAvatar avatarUrl={result.avatar} />
          <div className='flex flex-col truncate'>
            <div className='flex items-center justify-between'>
              <div className='w-36 truncate'>{result.name}</div>

              {showRemoveButton && (
                <Popover placement='bottom'>
                  <PopoverTrigger>
                    <button>
                      <MaterialSymbolsPersonRemoveRounded className='w-4 h-4 p-0 text-slate-500' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0 rounded-lg'>
                    <Button
                      isLoading={isDeleting}
                      color='danger'
                      variant='bordered'
                      className='p-0 border-0'
                      onClick={() => {
                        handleRemoveMember(currentCalendarId, result.userId);
                      }}
                    >
                      remove
                    </Button>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className='text-xs text-gray-400 truncate'>{result.email}</div>
          </div>
        </div>
        {type === 'invite' && (
          <InviteButton isMemberExist={isMemberExist} result={result} />
        )}
      </div>
    );
  };

  return (
    <div className='py-4 px-3 flex flex-col gap-3 overflow-y-auto'>
      <div
        className={clsx(
          'shadow-md flex items-center justify-center gap-2 h-10 text-lg leading-10 bg-slate-200 rounded-xl outline outline-1 outline-offset-2 text-white',
          currentThemeColor.darkBackground,
          currentThemeColor.outline,
        )}
      >
        <OcticonPeople16 />
        Members
      </div>

      <div className='flex-col items-center justify-center gap-2'>
        <Card
          className={clsx(
            'mt-2 shadow border-2',
            currentThemeColor.lightBorder,
          )}
        >
          <CardHeader>
            <div>Invite Friends</div>
          </CardHeader>
          <Divider />
          <CardBody className='relative'>
            <div className='flex items-center justify-between'>
              <input
                className={clsx(
                  'border rounded-lg px-2 w-[150px] text-sm h-9 leading-9 placeholder:h-9 mb-2 placeholder',
                  currentThemeColor.outline,
                )}
                placeholder='Search by email'
                value={searchInput}
                onChange={(e) => handleInputChange(e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isComposing && searchInput) {
                    handleSearch();
                  }
                }}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
              />
              <IcRoundSearch
                className={clsx(
                  'text-2xl mb-2 -mr-2 hover:cursor-pointer',
                  currentThemeColor.text,
                )}
                onClick={() => {
                  if (searchInput) {
                    handleSearch();
                  }
                }}
              />
            </div>

            {isLoading && <EosIconsLoading className='absolute top-12' />}

            {searchInput &&
              searchResult &&
              typeof searchResult !== 'string' &&
              renderSearchResult(searchResult, 0, 'invite')}

            {searchInput && searchResult === 'nonexistent' && (
              <div className='flex flex-col items-center justify-center h-20'>
                <IcRoundSearchOff className='text-2xl text-slate-600' />
                <div className='text-slate-600 ml-px'>User does not exist!</div>
              </div>
            )}

            {!searchResult && (
              <div className='flex flex-col items-center justify-center h-20'>
                <IcSharpPersonSearch className='text-2xl text-slate-400' />
                <div className='text-slate-400'>Enter email to search!</div>
              </div>
            )}
          </CardBody>
        </Card>

        <Card
          className={clsx(
            'mt-4 shadow border-2',
            currentThemeColor.lightBorder,
          )}
        >
          <CardHeader>
            <div>Member List ({memberDetails.length})</div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className='flex flex-col gap-3'>
              {memberDetails.length === 0 && <EosIconsLoading />}
              {memberDetails.map((memberDetail, index) =>
                renderSearchResult(memberDetail, index, 'list'),
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default UserCalendars;
