import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { File, Folder } from 'lucide-react';
import type { Resource } from '@extension/shared';

interface IProps {
  data: Resource;
  untitled: string;
  resourceId: string;
  privateText: string;
  teamspaceText: string;
  onCancel: () => void;
  onSearch: (val: string) => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FormResource(props: IProps) {
  const { data, untitled, privateText, teamspaceText, resourceId, onCancel, onSearch, onChange } = props;
  const resourceName = data.name || untitled;
  const name =
    data.parent_id && data.parent_id !== '0'
      ? resourceName
      : data.space_type === 'private'
        ? privateText
        : teamspaceText;

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
