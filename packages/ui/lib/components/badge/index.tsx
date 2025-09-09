import { useState } from 'react';

import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
  rootClassName?: string;
  slot: React.ReactNode;
  children: React.ReactNode;
}

export function Badge(props: IProps) {
  const { slot, className, children, rootClassName } = props;
  const [open, setOpen] = useState(false);
  const handleMouseEnter = () => {
    setOpen(true);
  };
  const handleMouseLeave = () => {
    setOpen(false);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={cn('relative', rootClassName)}>
      {children}
      <div
        className={cn('absolute right-[-7px] top-[-8px] z-[100] transition-opacity', className, {
          'opacity-0': !open,
          'opacity-100': open,
        })}>
        {slot}
      </div>
    </div>
  );
}
