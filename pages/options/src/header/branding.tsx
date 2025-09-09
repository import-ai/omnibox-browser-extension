export function Binding() {
  return (
    <div className="flex items-center gap-2">
      <div className="size-[30px]">
        <img src={chrome.runtime.getURL('icon-128.png')} alt="logo" />
      </div>
      <h1 className="text-xl font-medium text-gray-900">OmniBox</h1>
    </div>
  );
}
