import { Binding } from './branding';
import { Profile } from './profile';

interface IProps {
  baseUrl: string;
  refetch: () => void;
  namespaceId: string;
}

export function Header(props: IProps) {
  return (
    <div className="flex justify-between items-center px-[20px] py-[17px]">
      <Binding />
      <Profile {...props} />
    </div>
  );
}
