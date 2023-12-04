import {
  Button,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import EosIconsLoading from '~icons/eos-icons/loading';
import IcRoundSearchOff from '~icons/ic/round-search-off';
import MaterialSymbolsLightPersonAddRounded from '~icons/material-symbols-light/person-add-rounded';
import MaterialSymbolsPersonRemoveRounded from '~icons/material-symbols/person-remove-rounded';
import MaterialSymbolsSubdirectoryArrowLeftRounded from '~icons/material-symbols/subdirectory-arrow-left-rounded';
import { useAuthStore } from '../../../store/authStore';
import {
  addMemberToCalendar,
  getMemberSearchResults,
  removeMember,
} from '../../../utils/handleUserAndCalendar';
import { User } from '../../../utils/types';
import AvatarImage from '../avatar.png';

type Props = {
  memberDetails: User[];
  setMemberDetails: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserCalendars: React.FC<Props> = ({ memberDetails }) => {
  const { currentUser, currentCalendarId, currentCalendarContent } =
    useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const [searchResult, setSearchResult] = useState<User | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMemberExist, setIsMemberExist] = useState(false);

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
    setSearchResult(null);
    setIsMemberExist(false);
  };

  const handleSearch = async () => {
    if (!searchInput) return;
    setIsLoading(true);
    const result = await getMemberSearchResults(searchInput);

    if (result && typeof result !== 'string') {
      setSearchResult(result);
      if (currentCalendarContent.members.includes(result.userId)) {
        console.log('user已存在');
        setIsMemberExist(true);
      }
    } else if (result && typeof result == 'string') {
      setSearchResult(result);
    }

    setIsLoading(false);
  };

  const handleAddMember = async (result: User) => {
    const isSuccess = await addMemberToCalendar(
      currentCalendarId,
      result.userId,
      result.email,
    );
    if (isSuccess) {
      setSearchInput('');
      setSearchResult(null);
      setIsMemberExist(false);
      toast.success('Member added successfully!');
    } else {
      alert('Failed to add member.');
    }
  };

  const handleRemoveMember = async (calendarId: string, userId: string) => {
    removeMember(calendarId, userId);
  };

  interface UserAvatarProps {
    avatarUrl: string | undefined;
  }
  const UserAvatar: React.FC<UserAvatarProps> = ({ avatarUrl }) => (
    <img
      className='w-10 h-10 mr-2 rounded-full'
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
    <button
      disabled={isMemberExist}
      className='mt-2 h-6 w-full px-2 rounded bg-slate-200 flex gap-1 items-center justify-center'
      onClick={() => handleAddMember(result)}
    >
      {isMemberExist ? (
        <div className='text-xs truncate'>
          {result.name} is already a member
        </div>
      ) : (
        <>
          <MaterialSymbolsLightPersonAddRounded className='w-5 h-5' />
          <div className='text-xs truncate'>Invite {result.name}</div>
        </>
      )}
    </button>
  );

  const renderSearchResult = (result: User, index: number, type: string) => {
    return (
      <div key={index} className='flex flex-col'>
        <div className='flex items-center'>
          <UserAvatar avatarUrl={result.avatar} />
          <div className='flex flex-col truncate'>
            <div className='flex items-center justify-between'>
              <div className='truncate w-36'>{result.name}</div>
              {type !== 'invite' && result.userId !== currentUser.userId && (
                <Popover placement='bottom'>
                  <PopoverTrigger>
                    <button>
                      <MaterialSymbolsPersonRemoveRounded className='w-4 h-4 p-0 text-slate-500' />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className='p-0 rounded-lg'>
                    <Button
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
            <div className='truncate text-xs text-gray-400'>{result.email}</div>
          </div>
        </div>
        {type === 'invite' && (
          <InviteButton isMemberExist={isMemberExist} result={result} />
        )}
      </div>
    );
  };

  return (
    <div className='py-3 px-4 flex flex-col gap-3 overflow-y-auto'>
      <div className='text-center'>Members</div>

      <div className='flex-col items-center justify-center gap-2'>
        <div className='flex-col items-center justify-center gap-2 mt-2'>
          <div>Invite Friends</div>
          <Divider />
          <div className='flex items-center justify-between mb-2'>
            <input
              className='mt-2 border rounded px-2 w-40 text-sm h-8'
              placeholder='Search by email'
              value={searchInput}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <MaterialSymbolsSubdirectoryArrowLeftRounded
              className='w-6 h-6 mt-1 hover:cursor-pointer'
              onClick={handleSearch}
            />
          </div>

          {isLoading && <EosIconsLoading />}

          {searchInput &&
            searchResult &&
            typeof searchResult !== 'string' &&
            renderSearchResult(searchResult, 0, 'invite')}

          {searchInput && searchResult === 'nonexistent' && (
            <div className='flex items-center'>
              <IcRoundSearchOff />
              <div className='text-sm ml-px'>User does not exist!</div>
            </div>
          )}
        </div>

        <div className='mt-10'>Member List ({memberDetails.length})</div>
        <Divider />
        <div className='flex flex-col gap-2 mt-2'>
          {memberDetails.length === 0 && <EosIconsLoading />}
          {memberDetails.map((memberDetail, index) =>
            renderSearchResult(memberDetail, index, 'list'),
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCalendars;
