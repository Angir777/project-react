import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { environment } from '@environments';
import { store } from '@/core/store';
import { credentialsService, i18nService, Logger } from '@/core/services';
import { themeService } from '@/shared/services/theme/theme.service';
import { App } from '@/app';
import { routes } from '@/app.routes';
import { RouteError } from '@/features/error/route-error/route-error';
import './styles/styles.css';

// Logger prefix
const log = new Logger('DAILO');

// Logger setup
if (environment.PRODUCTION) {
  Logger.enableProductionMode();
}

log.debug('Init app..');

// Restore the saved credentials (and with them the permissions).
credentialsService.init();
log.debug(
  credentialsService.isAuthenticated()
    ? 'User is logged. Permissions reloaded.'
    : 'User is not logged. Permissions no reloaded.',
);

// Theme
themeService.init();

const queryClient = new QueryClient();

// `errorElement` replaces the default "Unexpected Application Error!" screen:
// the outer one catches errors of <App /> itself, the inner one renders inside <App />.
const router = createBrowserRouter([
  {
    element: <App />,
    errorElement: <RouteError />,
    children: [{ errorElement: <RouteError />, children: routes }],
  },
]);

// Translation settings
i18nService
  .init(environment.DEFAULT_LANGUAGE, environment.LANGUAGES_AVAILABLE)
  .catch((err) => console.error(err))
  .finally(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </Provider>
      </StrictMode>,
    );
  });
