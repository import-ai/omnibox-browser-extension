import { Save } from './Save';
import { Section } from './Section';
import { Activation } from './Activation';
import { Separator } from '@extension/ui';
import type { IProps } from '@src/types';

export function Keyboard(props: IProps) {
  return (
    <>
      <Section {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2]" />
      <Activation {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2]" />
      <Save {...props} />
    </>
  );
}
