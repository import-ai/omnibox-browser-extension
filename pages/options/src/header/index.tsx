import { cn } from '@extension/ui';
import { Binding } from './branding';
import { Profile } from './profile';

interface IProps {
  baseUrl: string;
  profile?: boolean;
  refetch: () => void;
  namespaceId: string;
}

export function Header(props: IProps) {
  const { profile, ...prop } = props;

  return (
    <div
      className={cn('flex items-center px-[20px] py-[17px]', {
        'justify-between': profile,
        'justify-start': !profile,
      })}>
      <Binding />
      {profile && <Profile {...prop} />}
    </div>
  );
}
