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
  SearchState,
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

enum CardType {
  Search = 'Invite Friends',
  List = 'Member List',
}

const Members: React.FC<Props> = ({ memberDetails }) => {
  const {
    currentUser,
    currentCalendarId,
    currentCalendarContent,
    currentThemeColor,
  } = useAuthStore();
  const [searchInput, setSearchInput] = useState('');
  const initialSearchResult: SearchState = {
    status: 'initial',
    data: null,
  };
  const [searchResult, setSearchResult] =
    useState<SearchState>(initialSearchResult);
  const [isLoading, setIsLoading] = useState(false);
  const [isMemberExist, setIsMemberExist] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValue = e.target.value.replace(/\s+/g, '');
    setSearchInput(updatedValue);
    setIsMemberExist(false);
  };

  const handleSearch = async (e?: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchInput) return;
    if (isComposing) return;
    if (e && e.key !== 'Enter') return;
    setIsLoading(true);
    const result = await getMemberSearchResults(searchInput);
    setSearchResult(result);

    if (
      result.status === 'found' &&
      currentCalendarContent.members.includes(result.data?.userId || '')
    ) {
      setIsMemberExist(true);
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
      setSearchResult(initialSearchResult);
      setIsMemberExist(false);
      toast.success('Member added successfully');
    } else {
      toast.error('Failed to add member!');
    }
    setIsInviting(false);
  };

  const handleRemoveMember = async (calendarId: string, userId: string) => {
    setIsDeleting(true);
    await removeMember(calendarId, userId);
    toast.success('Member removed successfully');
    setIsDeleting(false);
  };

  const renderInviteButton = (user: User) => {
    return (
      <Button
        isLoading={isInviting}
        disabled={isMemberExist}
        className={clsx(
          'mt-2 h-6 w-full px-2 rounded-md bg-slate-200 flex gap-1 items-center justify-center',
          currentThemeColor.lightBackground,
        )}
        onClick={() => handleAddMember(user)}
      >
        {isMemberExist ? (
          <div className='text-xs truncate'>Already a member</div>
        ) : (
          <>
            <MaterialSymbolsLightPersonAddRounded className='w-5 h-5' />
            <div className='text-xs truncate'>Invite {user.name}</div>
          </>
        )}
      </Button>
    );
  };

  const renderRemoveButton = (user: User) => {
    const shouldShowRemoveButton = () => {
      if (currentUser.userId === currentCalendarContent.members[0]) {
        return user.userId === currentUser.userId ? false : true;
      } else {
        return user.userId === currentUser.userId ? true : false;
      }
    };
    const showRemoveButton = shouldShowRemoveButton();

    return (
      showRemoveButton && (
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
                handleRemoveMember(currentCalendarId, user.userId);
              }}
            >
              remove
            </Button>
          </PopoverContent>
        </Popover>
      )
    );
  };

  const renderUserInfo = (user: User, type: CardType, index?: number) => {
    return (
      <div
        key={index}
        className={clsx('flex flex-col justify-center', {
          ['h-20']: type === CardType.Search,
        })}
      >
        <div className='flex items-center'>
          <img
            className='w-10 h-10 mr-2 rounded-full object-cover object-center'
            src={user.avatar || AvatarImage}
          />
          <div className='flex flex-col truncate'>
            <div className='flex items-center justify-between'>
              <div className='w-36 truncate'>{user.name}</div>
              {type === CardType.List && renderRemoveButton(user)}
            </div>
            <div className='text-xs text-gray-400 truncate'>{user.email}</div>
          </div>
        </div>
        {type === CardType.Search && renderInviteButton(user)}
      </div>
    );
  };

  const renderSearchResult = () => {
    if (!searchResult || searchResult.status === 'initial') {
      return (
        <div className='flex flex-col items-center justify-center h-20'>
          <IcSharpPersonSearch className='text-2xl text-slate-400' />
          <div className='text-slate-400'>Enter email to search!</div>
        </div>
      );
    }
    if (!searchResult.data) {
      return (
        <div className='flex flex-col items-center justify-center h-20'>
          <IcRoundSearchOff className='text-2xl text-slate-600' />
          <div className='text-slate-600 ml-px'>User does not exist!</div>
        </div>
      );
    }
    if (searchResult.data) {
      const user: User = searchResult.data;
      return renderUserInfo(user, CardType.Search);
    }
  };

  const renderCardBody = (type: CardType) => {
    if (type === CardType.Search) {
      return (
        <>
          <div className='flex items-center justify-between'>
            <input
              className={clsx(
                'border rounded-lg px-2 w-[150px] text-sm h-9 leading-9 placeholder:h-9 mb-2 placeholder',
                currentThemeColor.outline,
              )}
              placeholder='Search by email'
              value={searchInput}
              onChange={(e) => handleInputChange(e)}
              onKeyDown={(e) => handleSearch(e)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
            />
            <IcRoundSearch
              className={clsx(
                'text-2xl mb-2 -mr-2 hover:cursor-pointer',
                currentThemeColor.text,
              )}
              onClick={() => handleSearch()}
            />
          </div>

          {isLoading && <EosIconsLoading className='absolute top-12' />}
          {renderSearchResult()}
        </>
      );
    }
    if (type === CardType.List) {
      return (
        <div className='flex flex-col gap-3'>
          {memberDetails.length === 0 && <EosIconsLoading />}
          {memberDetails.map((memberDetail, index) =>
            renderUserInfo(memberDetail, CardType.List, index),
          )}
        </div>
      );
    }
  };

  const renderCards = (type: CardType) => {
    return (
      <Card
        className={clsx(
          'shadow border-2',
          currentThemeColor.lightBorder,
          type === CardType.Search ? 'mt-2' : 'mt-4',
        )}
      >
        <CardHeader>
          {type === CardType.Search
            ? CardType.Search
            : `${CardType.List} (${memberDetails.length})`}
        </CardHeader>
        <Divider />
        <CardBody>{renderCardBody(type)}</CardBody>
      </Card>
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
        {renderCards(CardType.Search)}
        {renderCards(CardType.List)}
      </div>
    </div>
  );
};

export { Members };
