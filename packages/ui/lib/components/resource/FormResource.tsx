import { cn } from '@/lib/utils';
import { t } from '@extension/i18n';
import { Button } from '../ui/button';
import { File, Folder } from 'lucide-react';
import type { Resource } from '@extension/shared';

interface IProps {
  data: Resource;
  resourceId: string;
  onCancel: () => void;
  onSearch: (val: string) => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FormResource(props: IProps) {
  const { data, resourceId, onCancel, onSearch, onChange } = props;
  const resourceName = data.name || t('untitled');
  const name = data.parent_id && data.parent_id !== '0' ? resourceName : t(data.space_type as 'private' | 'teamspace');

  return (
    <Button
      variant="ghost"
      className={cn('w-full flex h-auto whitespace-normal justify-start items-start font-normal rounded-none', {
        'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50': data.id === resourceId,
      })}
      onClick={() => {
        onChange(data.id, 'resourceId');
        onSearch('');
        onCancel();
      }}>
      {data.resource_type === 'folder' ? <Folder /> : <File />}
      <div className="text-left">{name}</div>
    </Button>
  );
}
