import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { environment } from '@environments';
import { cn } from '@/shadcn/lib/utils';
import { useAppDialog } from '@/shared/components/ui/dialog/dialog.context';
import { ChangelogDetailsModal } from '@/shared/components/ui/changelog-details-modal/changelog-details-modal';

const version = environment.VERSION;
const currentYear = new Date().getFullYear();

export function Footer() {
  const { t } = useTranslation();
  const dialogService = useAppDialog();

  // TODO: Check whether the system is up
  const [systemIsAvailable] = useState(true);

  const openChangelog = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    dialogService.open(ChangelogDetailsModal, {
      title: 'layout.header.changes',
      width: '800px',
      maximizable: true,
    });
  };

  return (
    <footer className="border-t bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex flex-col items-center justify-between gap-3 px-4 py-4 text-sm md:flex-row md:px-6">
        {/* Left */}
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <span className="font-medium text-zinc-700 dark:text-zinc-300">{t('main.appName')}</span>

          <span>{t('layout.footer.copyright', { year: currentYear })}</span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <button type="button" onClick={openChangelog} className="cursor-pointer">
            v{version}
          </button>

          <div
            className={cn(
              'h-2 w-2 rounded-full',
              systemIsAvailable ? 'bg-emerald-500' : 'bg-red-500',
            )}
          ></div>
        </div>
      </div>
    </footer>
  );
}
