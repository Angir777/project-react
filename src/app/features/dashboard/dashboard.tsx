import { useTranslation } from 'react-i18next';

export function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <p className="text-zinc-700 dark:text-zinc-300">{t('main.dashboard.imReady')}</p>
    </div>
  );
}
