import { Loader2 } from 'lucide-react';
import type { ButtonProps } from '../ui/button';
import { Button as ButtonUI } from '../ui/button';

interface ButtonLoadingProps extends ButtonProps {
  loading?: boolean;
  children?: React.ReactNode;
}

export function Button(props: ButtonLoadingProps) {
  const { loading, children, ...rest } = props;

  if (loading) {
    return (
      <ButtonUI disabled {...rest}>
        <Loader2 className="animate-spin" />
        {children}
      </ButtonUI>
    );
  }
  return <ButtonUI {...rest}>{children}</ButtonUI>;
}
