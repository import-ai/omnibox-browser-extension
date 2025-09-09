import { Binding } from './branding';
import { Profile } from './profile';

export function Header() {
  return (
    <div className="flex justify-between items-center px-[20px] py-[17px]">
      <Binding />
      <Profile />
    </div>
  );
}
