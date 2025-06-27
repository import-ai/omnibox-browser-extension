import { ServerIcon } from 'lucide-react';
import { Input, Button } from '@extension/ui';

export default function Access() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <ServerIcon className="size-4" />
        <span className="text-sm">正在访问</span>
      </div>
      <div className="flex gap-2">
        <Input className="w-64" value="https://omnibox.pro" />
        <Button>登陆</Button>
      </div>
    </div>
  );
}
