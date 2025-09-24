import zIndex from '@src/utils/zindex';

interface IProps {
  onPopup: (popup: boolean | ((prev: boolean) => boolean)) => void;
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { onPopup, children } = props;
  const zIndexValue = zIndex();
  const hanldeClose = () => {
    onPopup(false);
  };

  return (
    <>
      <div
        onClick={hanldeClose}
        className="fixed left-0 top-0 w-full h-full"
        style={{
          zIndex: zIndexValue,
        }}
      />
      <div
        className={`js-popup fixed top-[28px] right-[28px] rounded-[16px] px-[16px] py-[14px] w-[288px] bg-background text-foreground shadow-[0px_4px_12px_rgba(0,0,0,0.1)]`}
        style={{
          zIndex: zIndexValue + 1,
        }}>
        {children}
      </div>
    </>
  );
}
