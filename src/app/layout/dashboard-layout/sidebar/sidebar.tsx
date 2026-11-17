import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChevronRight, Command, GalleryVerticalEnd } from 'lucide-react';
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/shadcn/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shadcn/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { cn } from '@/shadcn/lib/utils';
import { TeamSwitcher, type Sidebar07Team } from '@/shadcn/blocks/sidebar-07/team-switcher';
import { NavUser, type Sidebar07User } from '@/shadcn/blocks/sidebar-07/nav-user';
import { useCredentials, usePermissions } from '@/core/services/credentials.service';
import { navItems as allNavItems, othersItems as allOthersItems } from '@/shared/constants';
import type { NavItem } from '@/shared/interfaces';
import { sidebarMenuService } from '@/shared/services/sidebar/sidebar-menu.service';

const teams: readonly Sidebar07Team[] = [
  { name: 'DAILO', logo: GalleryVerticalEnd, plan: 'Workspace' },
  { name: 'Personal', logo: Command, plan: 'Workspace' },
];

function NavIcon({ nav }: { nav: NavItem }) {
  return (
    <>
      {nav.icon && <span dangerouslySetInnerHTML={{ __html: nav.icon }} />}
      {nav.faIcon && <FontAwesomeIcon icon={nav.faIcon} />}
    </>
  );
}

export function Sidebar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { state, isMobile } = useSidebar();

  const credentials = useCredentials();
  const permissions = usePermissions();

  // Verify permissions for menu items
  const navItems = useMemo(
    () => sidebarMenuService.prepareMenu(allNavItems, permissions),
    [permissions],
  );
  const othersItems = useMemo(
    () => sidebarMenuService.prepareMenu(allOthersItems, permissions),
    [permissions],
  );

  // Opened submenu + submenus closed manually on the current route.
  const [menuState, setMenuState] = useState<{
    pathname: string | null;
    open: string | null;
    closed: string[];
  }>({ pathname: null, open: null, closed: [] });

  /** Desktop icon-only mode: grouped items are shown as a dropdown instead of a collapsible. */
  const isCollapsed = state === 'collapsed' && !isMobile;

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return pathname === '/';
    }

    return pathname.startsWith(path);
  };

  const isMenuActive = (nav: NavItem): boolean => {
    if (!nav.subItems?.length) {
      if (!nav.path) {
        return false;
      }

      return isActive(nav.path);
    }

    return nav.subItems.some((subItem) => isActive(subItem.path));
  };

  // Open the group that contains the current route (Angular: setActiveMenuFromRoute on NavigationEnd).
  if (menuState.pathname !== pathname) {
    let routeKey: string | null = null;

    [
      { items: navItems, prefix: 'main' },
      { items: othersItems, prefix: 'others' },
    ].forEach((group) => {
      group.items.forEach((nav, i) => {
        nav.subItems?.forEach((subItem) => {
          if (pathname === subItem.path) {
            routeKey = `${group.prefix}-${i}`;
          }
        });
      });
    });

    setMenuState({ pathname, open: routeKey ?? menuState.open, closed: [] });
  }

  const isOpen = (key: string, nav: NavItem) =>
    menuState.open === key || (isMenuActive(nav) && !menuState.closed.includes(key));

  const toggleSubmenu = (key: string, nav: NavItem) => {
    if (isOpen(key, nav)) {
      setMenuState((current) => ({ ...current, open: null, closed: [...current.closed, key] }));
    } else {
      setMenuState((current) => ({
        ...current,
        open: key,
        closed: current.closed.filter((item) => item !== key),
      }));
    }
  };

  const user: Sidebar07User | null = credentials
    ? {
        name: `${credentials.firstName} ${credentials.lastName}`.trim(),
        email: credentials.email,
        avatar: credentials.avatarUrl ?? '',
      }
    : null;

  const renderGroup = (items: NavItem[], section: 'main' | 'others') => (
    <SidebarMenu>
      {items.map((nav, i) => {
        const key = `${section}-${i}`;

        // Collapsed (icon) sidebar: grouped items open as a dropdown next to the icon
        if (nav.subItems && isCollapsed) {
          return (
            <SidebarMenuItem key={nav.name}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    isActive={isMenuActive(nav)}
                    aria-label={t(nav.name)}
                  >
                    <NavIcon nav={nav} />
                    <span>{t(nav.name)}</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="min-w-48 rounded-lg" side="right" align="start">
                  <DropdownMenuLabel>{t(nav.name)}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {nav.subItems.map((subItem) => (
                    <DropdownMenuItem
                      key={subItem.path}
                      asChild
                      className={isActive(subItem.path) ? 'bg-accent text-accent-foreground' : ''}
                    >
                      <Link to={subItem.path}>{t(subItem.name)}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        }

        if (nav.subItems) {
          return (
            <Collapsible
              key={nav.name}
              asChild
              open={isOpen(key, nav)}
              onOpenChange={() => toggleSubmenu(key, nav)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="cursor-pointer" tooltip={t(nav.name)}>
                    <NavIcon nav={nav} />
                    <span>{t(nav.name)}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {nav.subItems.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.path}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            (subItem.path === '/' ? pathname === '/' : isActive(subItem.path)) &&
                              'bg-sidebar-accent',
                          )}
                        >
                          <Link to={subItem.path}>
                            <span>{t(subItem.name)}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        if (nav.path) {
          return (
            <SidebarMenuItem key={nav.name}>
              <SidebarMenuButton
                asChild
                tooltip={t(nav.name)}
                className={cn(isActive(nav.path) && 'bg-sidebar-accent')}
              >
                <Link to={nav.path}>
                  <NavIcon nav={nav} />
                  <span>{t(nav.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        }

        return null;
      })}
    </SidebarMenu>
  );

  return (
    <SidebarRoot collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          {renderGroup(navItems, 'main')}
        </SidebarGroup>

        {othersItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Others</SidebarGroupLabel>
            {renderGroup(othersItems, 'others')}
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </SidebarRoot>
  );
}
