import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shadcn/components/ui/dropdown-menu';
import { useCredentials } from '@/core/services/credentials.service';
import { authenticationService } from '@/shared/services/authentication/authentication.service';

/**
 * User menu (kept for parity with the Angular project; the sidebar uses NavUser instead).
 */
export function UserDropdown() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const credentials = useCredentials();

  const userInitials =
    `${credentials?.firstName?.charAt(0) ?? ''}${credentials?.lastName?.charAt(0) ?? ''}`.toUpperCase();

  return (
    <DropdownMenu>
      {/* BUTTON */}
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-11 w-11 flex items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-0 overflow-hidden cursor-pointer"
        >
          {credentials?.avatarUrl ? (
            <img
              src={credentials.avatarUrl}
              className="block h-full w-full object-cover"
              alt="User"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {userInitials}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      {/* MENU */}
      <DropdownMenuContent className="w-60 rounded-lg" side="bottom" align="end" sideOffset={12}>
        {/* HEADER */}
        <DropdownMenuLabel>
          <div className="truncate font-medium text-foreground">
            {credentials?.firstName} {credentials?.lastName}
          </div>
          <div className="truncate text-xs font-normal text-muted-foreground">
            {credentials?.email}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* ITEMS */}
        <DropdownMenuItem onClick={() => navigate('/account')}>
          <User />
          {t('layout.header.user.myAccount')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* FOOTER */}
        <DropdownMenuItem onClick={() => authenticationService.logOut()}>
          <LogOut />
          {t('layout.header.user.logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
