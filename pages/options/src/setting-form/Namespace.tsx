import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  baseUrl: string;
  namespaceId: string;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FormNamespace(props: IProps) {
  const { baseUrl, namespaceId, onChange } = props;
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Namespace modal label={t('default_space')} baseUrl={baseUrl} namespaceId={namespaceId} />
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:w-1/2 max-w-7xl px-0 pt-10 pb-0">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ChooseNamespace
          baseUrl={baseUrl}
          onChange={onChange}
          onCancel={handleCancel}
          namespaceId={namespaceId}
          placeholder={t('search_for_namespace')}
        />
      </DialogContent>
    </Dialog>
  );
}
