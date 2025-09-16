import { Check, Folder } from 'lucide-react';
import type { Resource } from '@extension/shared';
import { cn, DropdownMenuItem } from '@extension/ui';

interface IProps {
  data: Resource;
  resourceId: string;
  onSearch: (val: string) => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FormResource(props: IProps) {
  const { data, resourceId, onSearch, onChange } = props;
  const resourceName = data.name || 'untitled';
  let name = resourceName;
  if ((!data.parent_id || data.parent_id === '0') && data.space_type) {
    name = data.space_type === 'private' ? 'private' : 'team';
  }
  const handleClick = () => {
    onChange(data.id, 'resourceId');
    onSearch('');
  };

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className={cn(
        'py-2 cursor-pointer justify-between rounded-[8px] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400',
        {
          'bg-gray-100 dark:bg-gray-400': data.id === resourceId,
        },
      )}>
      <div className="flex items-center gap-[8px]">
        <Folder className="size-4" />
        <span
          className={cn('text-[#171717] max-w-[128px] dark:text-white truncate', {
            'max-w-[152px]': data.id !== resourceId,
          })}>
          {name}
        </span>
      </div>
      {data.id === resourceId && <Check className="size-5 text-[#171717" />}
    </DropdownMenuItem>
  );
}
