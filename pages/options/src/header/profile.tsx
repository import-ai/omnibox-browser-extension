import { ChevronDown } from 'lucide-react';
import { useOption } from '@extension/shared';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

export function Profile() {
  const { data, refetch } = useOption();
  const handleOmnibox = () => {
    if (!data.apiBaseUrl) {
      return;
    }
    location.href = data.apiBaseUrl;
  };
  const handleLogout = () => {
    chrome.storage.sync.remove(['apiBaseUrl', 'namespaceId', 'resourceId']).then(refetch);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[6px] outline-0">
        <span className="text-[#333333]">逆光</span>
        <ChevronDown className="size-[16px] text-[#37352F] opacity-[0.35]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-[126px]">
        <DropdownMenuItem
          className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400"
          onClick={handleOmnibox}>
          我的OmniBox
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400"
          onClick={handleLogout}>
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
