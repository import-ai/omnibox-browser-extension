import FormResource from './FormResource';
import { useState, useEffect } from 'react';
import { ChooseWrapper } from './ChooseWrapper';
import type { Resource } from '@extension/shared';
import { User, Check, Search, LoaderCircle } from 'lucide-react';
import { cn, LazyInput, DropdownMenuSeparator, DropdownMenuItem } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  baseUrl: string;
  loading: boolean;
  namespaceId: string;
  resourceId: string;
  onChange: (val: unknown, key?: string) => void;
}

export function ChooseResource(props: IProps) {
  const { loading, baseUrl, namespaceId, resourceId, onChange } = props;
  const { t } = useTranslation();
  const [search, onSearch] = useState('');
  const [fetching, onFetching] = useState(false);
  const [data, onData] = useState<{
    privateRootId: string;
    teamRootId: string;
    private: Array<Resource>;
    team: Array<Resource>;
  }>({
    privateRootId: '',
    teamRootId: '',
    private: [],
    team: [],
  });
  const teamData = search ? data.team.filter(item => item.name?.includes(search)) : data.team;
  const privateData = search ? data.private.filter(item => item.name?.includes(search)) : data.private;
  const handlePrivateClick = () => {
    onChange(data.privateRootId, 'resourceId');
    onSearch('');
  };

  useEffect(() => {
    if (loading || !baseUrl || !namespaceId) {
      return;
    }
    onFetching(true);
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/root`,
      },
      response => {
        onFetching(false);
        if (!response.data) {
          return;
        }
        let teamRootId = '';
        let privateRootId = '';
        const items: Array<Resource> = [];
        const team: Array<Resource> = [];
        Object.keys(response.data).forEach(spaceType => {
          const item = response.data[spaceType];
          if (spaceType === 'private') {
            privateRootId = item.id;
          } else {
            teamRootId = item.id;
          }
          if (Array.isArray(item.children) && item.children.length > 0) {
            if (spaceType === 'private') {
              items.push(...item.children.filter((item: Resource) => item.resource_type === 'folder'));
            } else {
              team.push(...item.children.filter((item: Resource) => item.resource_type === 'folder'));
            }
          }
        });
        onData({ private: items, team, teamRootId, privateRootId });
      },
    );
  }, [baseUrl, loading, namespaceId]);

  return (
    <>
      <DropdownMenuItem className="relative p-0">
        {fetching ? (
          <LoaderCircle className="absolute left-[12px] top-[10px] size-4 opacity-50 transition-transform animate-spin" />
        ) : (
          <Search className="absolute left-[12px] top-[10px] size-4 opacity-50 hover:bg-transparent focus-visible:outline-none" />
        )}
        <LazyInput
          value={search}
          onChange={onSearch}
          placeholder={t('search_placeholder')}
          className="pl-8 border-none shadow-none outline-none"
        />
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <div className="max-h-[291px] overflow-y-auto no-scrollbar ">
        <DropdownMenuItem
          onClick={handlePrivateClick}
          className={cn(
            'py-2 gap-[6px] rounded-[8px] justify-between cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-[#171717]',
            {
              'bg-gray-100 dark:bg-[#171717]': data.privateRootId === resourceId,
            },
          )}>
          <div className="flex items-center gap-[8px]">
            <User className="size-4" />
            <span className="text-[#171717] dark:text-white">{t('personal')}</span>
          </div>
          {data.privateRootId === resourceId && <Check className="size-5 text-[#171717" />}
        </DropdownMenuItem>
        {privateData.map(item => (
          <FormResource data={item} key={item.id} onSearch={onSearch} onChange={onChange} resourceId={resourceId} />
        ))}
        <ChooseWrapper
          baseUrl={baseUrl}
          namespaceId={namespaceId}
          resourceId={resourceId}
          onSearch={onSearch}
          teamRootId={data.teamRootId}
          data={teamData}
          onChange={onChange}
        />
      </div>
    </>
  );
}
