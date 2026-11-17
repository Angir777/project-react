import { useCallback, useMemo, useState, type ComponentType, type ReactNode } from 'react';
import { AppDialogShell } from './dialog-shell';
import {
  AppDialogServiceContext,
  type AppDialogConfig,
  type AppDialogRef,
  type AppDialogService,
} from './dialog.context';

interface OpenedDialog {
  id: number;
  component: ComponentType;
  config: AppDialogConfig<unknown>;
  open: boolean;
  resolve: (result: unknown) => void;
}

let nextId = 0;

/**
 * Equivalent of the Angular `AppDialogService` (CDK Dialog + AppDialogShellComponent).
 * Renders the opened dialogs; use `useAppDialog().open(Component, config)` to open one.
 */
export function AppDialogProvider({ children }: { children: ReactNode }) {
  const [dialogs, setDialogs] = useState<OpenedDialog[]>([]);

  const close = useCallback((id: number, result?: unknown) => {
    setDialogs((list) =>
      list.map((dialog) => {
        if (dialog.id === id && dialog.open) {
          dialog.resolve(result);
          return { ...dialog, open: false };
        }
        return dialog;
      }),
    );

    // Unmount after the close animation.
    setTimeout(() => setDialogs((list) => list.filter((dialog) => dialog.id !== id)), 300);
  }, []);

  const service = useMemo<AppDialogService>(
    () => ({
      open<R = unknown, D = unknown>(
        component: ComponentType,
        config: AppDialogConfig<D>,
      ): AppDialogRef<R> {
        const id = nextId++;
        let resolve!: (result: unknown) => void;
        const closed = new Promise<R | undefined>((res) => {
          resolve = res as (result: unknown) => void;
        });

        setDialogs((list) => [
          ...list,
          { id, component, config: config as AppDialogConfig<unknown>, open: true, resolve },
        ]);

        return {
          close: (result?: R) => close(id, result),
          closed,
        };
      },
    }),
    [close],
  );

  return (
    <AppDialogServiceContext.Provider value={service}>
      {children}

      {dialogs.map((dialog) => (
        <AppDialogShell
          key={dialog.id}
          component={dialog.component}
          config={dialog.config}
          open={dialog.open}
          onClose={(result) => close(dialog.id, result)}
        />
      ))}
    </AppDialogServiceContext.Provider>
  );
}
