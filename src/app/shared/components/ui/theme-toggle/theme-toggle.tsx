import { Button } from '@/shadcn/components/ui/button';
import { themeService, useTheme } from '../../../services/theme/theme.service';
import { MoonIcon, SunIcon } from './theme-icons';

export function ThemeToggle() {
  const theme = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      type="button"
      aria-label="Toggle theme"
      onClick={() => themeService.toggleTheme()}
    >
      {theme === 'dark' ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </Button>
  );
}
