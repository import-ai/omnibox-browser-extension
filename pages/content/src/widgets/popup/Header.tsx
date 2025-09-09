import { useRef } from 'react';
import { SettingIcon } from '@src/icon/setting';
import { QuestionIcon } from '@src/icon/question';
import { axios } from '@extension/shared/lib/utils/axios';
import { Button, Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@extension/ui';

interface IProps {
  baseUrl: string;
  refetch: () => void;
}

export default function Header({ baseUrl, refetch }: IProps) {
  const containerRef = useRef(null);
  const handleOption = () => {
    chrome.runtime.openOptionsPage();
  };
  const handleLogout = () => {
    axios(`${baseUrl}/api/v1/logout`, { method: 'POST' }).finally(() => {
      chrome.storage.sync.remove(['namespaceId', 'resourceId'], refetch);
    });
  };

  return (
    <div ref={containerRef} className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="size-[16px]">
          <img src={chrome.runtime.getURL('icon-128.png')} alt="logo" />
        </div>
        <div className="text-sm font-[600] text-[#171717]">OmniBox</div>
      </div>
      <div className="flex items-center gap-[12px]">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="size-[20px]" onClick={handleOption}>
                <QuestionIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent container={containerRef.current}>意见反馈</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="size-[20px]" onClick={handleLogout}>
                <SettingIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent container={containerRef.current}>偏好设置</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
