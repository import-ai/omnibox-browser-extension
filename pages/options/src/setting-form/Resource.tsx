import { useState } from 'react';
// import { t } from '@extension/i18n';
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
          label="默认收藏至"
          baseUrl={baseUrl}
          namespaceId={namespaceId}
          resourceId={resourceId}
        />
      </DialogTrigger>
      <DialogContent className="w-[90%] sm:w-1/2 max-w-7xl px-0 pt-10 pb-0">
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ChooseResource
          modal
          apiKey={apiKey}
          baseUrl={baseUrl}
          onChange={onChange}
          onCancel={handleCancel}
          resourceId={resourceId}
          namespaceId={namespaceId}
        />
      </DialogContent>
    </Dialog>
  );
}
