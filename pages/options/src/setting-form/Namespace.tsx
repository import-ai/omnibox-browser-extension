import { useState } from 'react';
import { t } from '@extension/i18n';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Namespace,
  ChooseNamespace,
} from '@extension/ui';

interface IProps {
  apiKey: string;
  baseUrl: string;
  namespaceId: string;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FormNamespace(props: IProps) {
  const { apiKey, baseUrl, namespaceId, onChange } = props;
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Namespace modal apiKey={apiKey} label={t('default_space')} baseUrl={baseUrl} namespaceId={namespaceId} />
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:w-1/2 max-w-7xl px-0 pt-10 pb-0">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ChooseNamespace
          modal
          apiKey={apiKey}
          baseUrl={baseUrl}
          onChange={onChange}
          onCancel={handleCancel}
          namespaceId={namespaceId}
        />
      </DialogContent>
    </Dialog>
  );
}
