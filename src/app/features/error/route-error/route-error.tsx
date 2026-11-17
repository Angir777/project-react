import { isRouteErrorResponse, Link, useRouteError } from 'react-router';
import { useTranslation } from 'react-i18next';
import { GridShape } from '@/shared/components/ui/grid-shape/grid-shape';
import { NotFound } from '../not-found/not-found';

const currentYear = new Date().getFullYear();

/**
 * Messages thrown by browsers when a lazy-loaded chunk (`import()`) cannot be fetched,
 * e.g. the dev server is stopped or a new deployment removed the old chunk files.
 */
const chunkLoadErrorPatterns = [
  'Failed to fetch dynamically imported module', // Chrome / Edge
  'error loading dynamically imported module', // Firefox
  'Importing a module script failed', // Safari
];

const isChunkLoadError = (error: unknown): boolean =>
  error instanceof Error &&
  chunkLoadErrorPatterns.some((pattern) => error.message.includes(pattern));

/**
 * Router `errorElement`: replaces the default "Unexpected Application Error!" screen.
 * - 404 route responses -> NotFound page,
 * - lazy chunk load failures -> "page could not be loaded" with a reload button,
 * - any other error -> generic error page.
 */
export function RouteError() {
  const { t } = useTranslation();
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFound />;
  }

  console.error(error);

  const chunkError = isChunkLoadError(error);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
      <GridShape />

      <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
        <h1 className="mb-8 font-bold text-zinc-800 dark:text-zinc-100 text-title-md xl:text-title-2xl">
          {t('error.pageTitle.error')}
        </h1>

        <img src="/assets/images/error/500.svg" alt="500" className="dark:hidden" />
        <img src="/assets/images/error/500-dark.svg" alt="500" className="hidden dark:block" />

        <p className="mt-10 mb-6 text-base text-zinc-600 dark:text-zinc-400 sm:text-lg">
          {t(chunkError ? 'error.texts.chunkLoad' : 'error.texts.unexpected')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 shadow-theme-xs hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {t('error.buttons.reload')}
          </button>

          <Link
            to="/"
            reloadDocument
            className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 py-3.5 text-sm font-medium text-zinc-700 shadow-theme-xs hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            {t('error.buttons.backToDashboard')}
          </Link>
        </div>
      </div>

      <p className="absolute text-sm text-center text-zinc-500 -translate-x-1/2 bottom-6 left-1/2">
        &copy; {currentYear} - {t('main.appName')}
      </p>
    </div>
  );
}
