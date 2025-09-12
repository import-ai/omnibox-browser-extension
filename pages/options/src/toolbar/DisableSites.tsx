import type { IProps } from '@src/types';
import { RemoveIcon } from '@src/icon/remove';
import { useTranslation } from 'react-i18next';

export function DisableSites(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const items = data.disabledSites || [];
  const handleRemoveSite = (host: string) => {
    const updatedSites = items.filter(site => site.host !== host);
    onChange(updatedSites, 'disabledSites');
  };

  const renderSiteItems = () => {
    if (items.length === 0) {
      return <div className="text-sm text-gray-500 text-center py-8">{t('no_disabled_sites')}</div>;
    }

    const siteElements = items.map(site => (
      <div
        key={site.host}
        className="flex items-center flex-1 max-w-[284px] justify-between rounded-[16px] border border-[#F2F2F2] p-[16px] dark:border-gray-600">
        <div className="flex items-center gap-[6px]">
          <div className="size-[16px]">
            <img src={site.icon} alt="logo" />
          </div>
          <div className="text-xs font-[500] text-[#171717] dark:text-[#f8f2f2]">{site.host}</div>
        </div>
        <button
          type="button"
          className="cursor-pointer bg-transparent border-none p-0"
          onClick={() => handleRemoveSite(site.host)}
          aria-label={`移除 ${site.host}`}>
          <RemoveIcon />
        </button>
      </div>
    ));

    // Group items into rows of 2
    const rows = [];
    for (let i = 0; i < siteElements.length; i += 2) {
      const rowItems = siteElements.slice(i, i + 2);
      rows.push(
        <div key={`row-${i}`} className="flex justify-between gap-[12px] mb-[12px]">
          {rowItems}
          {rowItems.length === 1 && <div className="flex-1 max-w-[284px]" />}
        </div>,
      );
    }

    return rows;
  };

  return (
    <div className="flex flex-col">
      <span className="font-[500]">{t('disabled_sites')}</span>
      <div className="mt-[22px]">{renderSiteItems()}</div>
    </div>
  );
}
