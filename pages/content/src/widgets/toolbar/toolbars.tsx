import { X } from 'lucide-react';
import { SaveIcon } from '@src/icon/save';
import { CopyIcon } from '@src/icon/copy';
import {
  Badge,
  Button,
  Separator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@extension/ui';

export function Toolbars() {
  return (
    <Badge
      rootClassName="flex items-center px-[10px] py-[4px] gap-[2px]"
      slot={
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-0">
            <Button size="icon" variant="ghost" className="size-[16px] bg-[#333] opacity-30 text-white rounded-full">
              <X className="size-[10px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="min-w-[126px]">
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400">
              隐藏至下次访问
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400">
              对此网站禁用
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400">
              全局禁用
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              在<a href="/">设置</a>中可以重新启用
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }>
      <Button size="icon" variant="ghost" className="size-[24px]">
        <CopyIcon />
      </Button>
      <Separator orientation="vertical" className="h-[16px] bg-[#EDEDF2]" />
      <Button size="icon" variant="ghost" className="size-[24px]">
        <SaveIcon />
      </Button>
    </Badge>
  );
}
