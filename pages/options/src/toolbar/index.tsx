import { Audio } from './Audio';
import { Section } from './Section';
import type { IProps } from '@src/types';
import { SectionText } from './SelectionText';
import { DisableSites } from './DisableSites';
import { Separator } from '@extension/ui';

export function Toolbar(props: IProps) {
  return (
    <>
      <Audio {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2]" />
      <Section {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2]" />
      <SectionText {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2]" />
      <DisableSites {...props} />
    </>
  );
}
