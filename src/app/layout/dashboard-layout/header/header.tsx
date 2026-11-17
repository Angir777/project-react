import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { SidebarTrigger } from '@/shadcn/components/ui/sidebar';
import { Separator } from '@/shadcn/components/ui/separator';
import { Input } from '@/shadcn/components/ui/input';
import { useCredentials } from '@/core/services/credentials.service';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle/theme-toggle';
import { LanguageDropdown } from './language-dropdown/language-dropdown';
import { NotificationDropdown } from './notification-dropdown/notification-dropdown';

export function Header() {
  const { t } = useTranslation();
  const searchInput = useRef<HTMLInputElement>(null);
  const credentials = useCredentials();

  const webNotificationsEnabled = credentials?.settings?.['webNotifications'] === true;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        {/* Sidebar toggle */}
        <SidebarTrigger className="-ml-1 cursor-pointer" aria-label="Toggle Sidebar" />

        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 data-[orientation=vertical]:self-center"
        />

        {/* Search */}
        <div role="search" className="relative hidden w-full max-w-sm md:block">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchInput}
            id="header-search"
            name="search"
            type="search"
            autoComplete="off"
            className="pl-8 pr-14"
            placeholder={t('layout.header.search.title')}
            aria-label={t('layout.header.search.title')}
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 inline-flex h-5 -translate-y-1/2 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <LanguageDropdown />
          {webNotificationsEnabled && <NotificationDropdown />}
        </div>
      </div>
    </header>
  );
}
