import { themeService } from '../../../services/theme/theme.service';
import { MoonIcon, SunIcon } from '../theme-toggle/theme-icons';

export function ThemeToggleTwo() {
  return (
    <button
      type="button"
      onClick={() => themeService.toggleTheme()}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md border border-white/30 dark:border-zinc-700/50 text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-zinc-700/70 transition-all duration-200 cursor-pointer"
    >
      {/* SUN */}
      <SunIcon className="hidden dark:block" width={20} height={20} />

      {/* MOON */}
      <MoonIcon className="dark:hidden" width={20} height={20} />
    </button>
  );
}
