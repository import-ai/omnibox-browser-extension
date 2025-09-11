import { useRef } from 'react';
import { SettingIcon } from '@src/icon/setting';
import { QuestionIcon } from '@src/icon/question';
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@extension/ui';

export default function Header() {
  const containerRef = useRef(null);
  const handleOption = () => {
    chrome.runtime.sendMessage({ action: 'openOptionsPage' });
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
              <Button size="icon" variant="ghost" className="size-[20px]">
                <QuestionIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent container={containerRef.current}>意见反馈</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="size-[20px]" onClick={handleOption}>
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
