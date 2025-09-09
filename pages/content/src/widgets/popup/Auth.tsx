import { Button } from '@extension/ui';

export function Auth() {
  const handleAuth = () => {
    //todo
  };

  return (
    <div>
      <p className="text-sm text-[#585D65] mt-[28px] mb-[24px]">登录后即可使用</p>
      <Button variant="default" onClick={handleAuth} className="w-full flex items-center rounded-[8px] mt-[20px]">
        立即登录
      </Button>
    </div>
  );
}
