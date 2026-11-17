import { useTranslation } from 'react-i18next';
import { Bell } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
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
import { cn } from '@/shadcn/lib/utils';

// TODO: New notifications
const notifications = [
  {
    user: 'John Doe',
    message: 'Example new notification..',
    time: '5 min ago',
    avatar: '/assets/images/avatar/avatar.png',
    online: true,
  },
];

export function NotificationDropdown() {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="relative"
          aria-label={t('layout.header.notification.title')}
        >
          <Bell />

          {/* New notifications indicator */}
          {notifications.length > 0 && (
            <span className="absolute right-1 top-1 flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-orange-500"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 rounded-lg" side="bottom" align="end">
        <DropdownMenuLabel>{t('layout.header.notification.title')}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="max-h-80 overflow-y-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.user} className="items-start gap-3 py-2">
              <div className="relative">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={notification.avatar} alt={notification.user} />
                  <AvatarFallback className="rounded-lg">
                    {notification.user.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    'absolute end-0 bottom-0 z-10 size-2.5 rounded-full ring-2 ring-background',
                    notification.online ? 'bg-green-500' : 'bg-red-500',
                  )}
                />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{notification.user}</span>
                <span className="text-muted-foreground text-xs">{notification.message}</span>
                <span className="text-muted-foreground mt-1 text-xs">{notification.time}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="justify-center font-medium">
          {t('layout.header.notification.seeAll')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
