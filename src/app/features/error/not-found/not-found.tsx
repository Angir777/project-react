import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { GridShape } from '@/shared/components/ui/grid-shape/grid-shape';

const currentYear = new Date().getFullYear();

export function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />

      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-zinc-800 dark:text-zinc-800 text-title-md xl:text-title-2xl">
          {t('error.pageTitle.error')}
        </h1>

        <img src="/assets/images/error/404.svg" alt="404" className="dark:hidden" />
        <img src="/assets/images/error/404.svg" alt="404" className="hidden dark:block" />

        <p className="mt-10 mb-6 text-base text-zinc-600 dark:text-zinc-600 sm:text-lg">
          {t('error.texts.info')}
        </p>

        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 shadow-theme-xs hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-200 dark:bg-white dark:text-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
        >
          {t('error.buttons.backToDashboard')}
        </Link>
      </div>

      <p className="absolute text-sm text-center text-zinc-500 dark:text-zinc-500 -translate-x-1/2 bottom-6 left-1/2">
        &copy; {currentYear} - {t('main.appName')}
      </p>
    </div>
  );
}
