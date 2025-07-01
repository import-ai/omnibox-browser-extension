import { Input } from '../ui/input';
import { useRef, useState, useEffect } from 'react';

interface IProps extends Omit<React.ComponentProps<'input'>, 'onChange'> {
  value: string;
  className?: string;
  onChange: (val: string) => void;
}

export function LazyInput(props: IProps) {
  const { value, onChange, ...prop } = props;
  const [data, onData] = useState(value);
  const timer = useRef<NodeJS.Timeout>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val.length <= 0) {
      onData('');
    } else {
      onData(val);
    }
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      onChange(val);
    }, 1000);
  };

  useEffect(() => {
    onData(value);
  }, [value]);

  return <Input type="url" {...prop} value={data} onChange={handleChange} />;
}
