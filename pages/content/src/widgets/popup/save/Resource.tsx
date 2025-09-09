import { Check, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  container: HTMLElement | null;
}

export function Resource(props: IProps) {
  const { container } = props;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[4px] outline-0">
        <span className="text-[16px] font-[600] text-[#171717] max-w-[180px] truncate">逆光～</span>
        <ChevronDown className="size-[16px] text-[#171717]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-[200px]" container={container}>
        <DropdownMenuItem className="py-2 cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400">
          <span className="text-[#171717]">我的OmniBox</span>
          <Check className="size-5 text-[#171717" />
        </DropdownMenuItem>
        <DropdownMenuItem className="py-2 cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400">
          <span className="text-[#171717]">退出登录</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
