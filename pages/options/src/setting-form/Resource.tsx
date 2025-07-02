import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Resource,
  ChooseResource,
} from '@extension/ui';

interface IProps {
  apiKey: string;
  baseUrl: string;
  resourceId: string;
  namespaceId: string;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FormResource(props: IProps) {
  const { apiKey, baseUrl, resourceId, namespaceId, onChange } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Resource
          modal
          apiKey={apiKey}
          baseUrl={baseUrl}
          untitled={t('untitled')}
          resourceId={resourceId}
          namespaceId={namespaceId}
          privateText={t('private')}
          teamspaceText={t('teamspace')}
          label={t('default_collect_to')}
        />
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:w-1/2 max-w-7xl px-0 pt-10 pb-0">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ChooseResource
          apiKey={apiKey}
          baseUrl={baseUrl}
          onChange={onChange}
          untitled={t('untitled')}
          onCancel={handleCancel}
          resourceId={resourceId}
          namespaceId={namespaceId}
          privateText={t('private')}
          teamspaceText={t('teamspace')}
          placeholder={t('search_for_resource')}
        />
      </DialogContent>
    </Dialog>
  );
}
