import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

export function Profile() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[6px] outline-0">
        <span className="text-[#333333]">逆光～</span>
        <ChevronDown className="size-[16px] text-[#37352F] opacity-[0.35]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-[126px]">
        <DropdownMenuItem className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400">
          我的OmniBox
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400">
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
