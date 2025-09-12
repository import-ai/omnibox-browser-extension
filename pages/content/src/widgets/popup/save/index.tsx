import { Resource } from './resource';
import useApp from '@src/hooks/useApp';
import { Namespace } from './Namespace';
import { useState, useEffect } from 'react';
import type { Response, Storage } from '@extension/shared';
import { useTranslation } from 'react-i18next';

interface IProps extends Omit<Response, 'refetch'> {
  data: Storage;
  loading: boolean;
}

export function Save(props: IProps) {
  const { data, loading, onChange } = props;
  const { container } = useApp();
  const { t } = useTranslation();
  const [target, onTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const containerRef = container.querySelector('.js-popup') as HTMLElement;
    if (containerRef) {
      onTarget(containerRef);
    }
  }, [container]);

  return (
    <div className="flex flex-wrap items-center gap-[8px] my-[20px]">
      <span className="text-sm text-muted-foreground">{t('save_to')}</span>
      <Namespace
        loading={loading}
        onChange={onChange}
        baseUrl={data.apiBaseUrl}
        namespaceId={data.namespaceId}
        container={target}
      />
      <Resource
        loading={loading}
        onChange={onChange}
        baseUrl={data.apiBaseUrl}
        namespaceId={data.namespaceId}
        resourceId={data.resourceId}
        container={target}
      />
    </div>
  );
}
