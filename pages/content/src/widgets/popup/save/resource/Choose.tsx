import FormResource from './FormResource';
import { useState, useEffect } from 'react';
import { ChooseWrapper } from './ChooseWrapper';
import type { Resource } from '@extension/shared';
import { User, Search, LoaderCircle } from 'lucide-react';
import { LazyInput, DropdownMenuSeparator, DropdownMenuItem } from '@extension/ui';
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
    private: Array<Resource>;
    team: Array<Resource>;
  }>({
    private: [],
    team: [],
  });
  const teamData = search ? data.team.filter(item => item.name?.includes(search)) : data.team;
  const privateData = search ? data.private.filter(item => item.name?.includes(search)) : data.private;

  useEffect(() => {
    if (loading || !baseUrl || !namespaceId) {
      return;
    }
    onFetching(true);
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        query: { namespace_id: namespaceId },
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/root`,
      },
      response => {
        onFetching(false);
        if (!response.data) {
          return;
        }
        const items: Array<Resource> = [];
        const team: Array<Resource> = [];
        Object.keys(response.data).forEach(spaceType => {
          const item = response.data[spaceType];
          if (Array.isArray(item.children) && item.children.length > 0) {
            if (spaceType === 'private') {
              items.push(...item.children);
            } else {
              team.push(...item.children);
            }
          }
        });
        onData({ private: items, team });
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
      <div className="max-h-[291px] overflow-y-auto">
        {privateData.length > 0 && (
          <>
            <DropdownMenuItem className="py-2 gap-[6px] rounded-[8px] cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400">
              <User />
              <span className="text-[#171717] dark:text-white">{t('personal')}</span>
            </DropdownMenuItem>
            {privateData.map(item => (
              <FormResource data={item} key={item.id} onSearch={onSearch} onChange={onChange} resourceId={resourceId} />
            ))}
          </>
        )}
        <ChooseWrapper
          baseUrl={baseUrl}
          namespaceId={namespaceId}
          resourceId={resourceId}
          onSearch={onSearch}
          data={teamData}
          onChange={onChange}
        />
      </div>
    </>
  );
}
