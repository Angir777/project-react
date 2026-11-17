import { store, themeActions, useAppSelector, type Theme } from '@/core/store';

export type { Theme } from '@/core/store';

/**
 * Equivalent of the Angular ThemeService.
 */
export const themeService = {
  init() {
    const savedTheme = (localStorage.getItem('THEME_APP') as Theme) || 'light';
    this.setTheme(savedTheme);
  },

  toggleTheme() {
    const newTheme = store.getState().theme.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  },

  setTheme(theme: Theme) {
    store.dispatch(themeActions.setTheme(theme));
    localStorage.setItem('THEME_APP', theme);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark:bg-neutral-950');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark:bg-neutral-950');
    }
  },
};

/**
 * Reactive theme value (Angular: `theme$`).
 */
export const useTheme = () => useAppSelector((state) => state.theme.theme);
