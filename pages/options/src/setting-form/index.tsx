import Access from './Access';
import Resource from './Resource';
import Namespace from './Namespace';

export default function SettingForm() {
  return (
    <div className="px-2 space-y-6">
      <Access />
      <Namespace />
      <Resource />
    </div>
  );
}
