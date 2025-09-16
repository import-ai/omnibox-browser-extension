import { Section } from './Section';
import type { IProps } from '@src/types';
import { SectionText } from './SelectionText';
import { DisableSites } from './DisableSites';
import { Separator } from '@extension/ui';

export function Toolbar(props: IProps) {
  return (
    <>
      <Section {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2] dark:bg-gray-600" />
      <SectionText {...props} />
      <Separator className="my-[24px] bg-[#F2F2F2] dark:bg-gray-600" />
      <DisableSites {...props} />
    </>
  );
}
