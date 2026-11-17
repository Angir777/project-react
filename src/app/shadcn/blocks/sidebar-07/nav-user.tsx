import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { BadgeCheck, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/shadcn/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/shadcn/components/ui/sidebar';
import { authenticationService } from '@/shared/services/authentication/authentication.service';

export interface Sidebar07User {
  readonly name: string;
  readonly email: string;
  readonly avatar: string;
}

/**
 * shadcn sidebar-07 block: user menu in the sidebar footer
 * (customized in the app: My account and Log out).
 */
export function NavUser({ user }: { user: Sidebar07User }) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const userInitials = user.name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const avatar = (
    <Avatar className="size-8 rounded-full">
      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
      <AvatarFallback className="rounded-full">{userInitials}</AvatarFallback>
    </Avatar>
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {avatar}

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>

              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {avatar}

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/upgrade-to-pro">
                  <Sparkles />
                  Upgrade to Pro
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link to="/account">
                  <BadgeCheck />
                  {t('layout.header.user.myAccount')}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/billing">
                  <CreditCard />
                  Billing
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => authenticationService.logOut()}>
              <LogOut />
              {t('layout.header.user.logOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
