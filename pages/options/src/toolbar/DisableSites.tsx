import type { IProps } from '@src/types';
import { RemoveIcon } from '@src/icon/remove';

export function DisableSites(props: IProps) {
  const { data } = props;

  return (
    <div className="flex flex-col">
      <span className="font-[500]">禁用的网站</span>
      <div className="mt-[22px]">
        <div className="flex justify-between gap-[12px] mb-[12px]">
          <div className="flex items-center flex-1 max-w-[284px] justify-between rounded-[16px] border border-[#F2F2F2] p-[16px]">
            <div className="flex items-center gap-[6px]">
              <div className="size-[16px]">
                <img src={chrome.runtime.getURL('icon-128.png')} alt="logo" />
              </div>
              <div className="text-xs font-[500] text-[#171717]">xiaohongshu.com</div>
            </div>
            <div className="cursor-pointer">
              <RemoveIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
