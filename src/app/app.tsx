import { useEffect, useState } from 'react';
import { Outlet, ScrollRestoration, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { environment } from '@environments';
import { Toaster } from '@/shadcn/components/ui/sonner';
import { TooltipProvider } from '@/shadcn/components/ui/tooltip';
import { navigationService } from './core/services/navigation.service';
import { useCurrentBreadcrumb } from './core/router/route-handle';
import { AppDialogProvider } from './shared/components/ui/dialog/dialog.service';
import { DemoBanner } from './shared/components/ui/demo-banner/demo-banner';
import { useTheme } from './shared/services/theme/theme.service';

/**
 * Root component.
 */
export function App() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const breadcrumb = useCurrentBreadcrumb();

  const appVersion = environment.PRODUCTION;
  const [showTestBanner, setShowTestBanner] = useState(false); // TODO: Set to true when the work is finished.

  // Toast theme
  const theme = useTheme();

  // Router access for services (e.g. logout from the HTTP interceptor)
  useEffect(() => {
    navigationService.register(navigate);
  }, [navigate]);

  // Page title (route change + language change)
  useEffect(() => {
    const envPrefix = appVersion ? '' : 'DEMO - ';

    const pageTitle = t('main.appName');

    const subPageTitle = breadcrumb ? t(breadcrumb) : '';

    document.title = subPageTitle
      ? `${envPrefix}${pageTitle} - ${subPageTitle}`
      : `${envPrefix}${pageTitle}`;
  }, [appVersion, breadcrumb, t, i18n.language]);

  return (
    <TooltipProvider>
      <AppDialogProvider>
        {!appVersion && showTestBanner && <DemoBanner onClose={() => setShowTestBanner(false)} />}

        <Toaster position="top-right" theme={theme} richColors closeButton />

        <Outlet />

        <ScrollRestoration />
      </AppDialogProvider>
    </TooltipProvider>
  );
}
