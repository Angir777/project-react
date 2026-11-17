import { createContext, useContext, type ComponentType } from 'react';

export interface AppDialogConfig<D> {
  /** Title translation key. */
  title: string;
  /** Dialog width, e.g. '1000px'. Limited to 95vw on small screens. */
  width?: string;
  /** Data available in the content component via `useDialogData()`. */
  data?: D;
  /** Maximize button in the header. */
  maximizable?: boolean;
  /** Prevents closing with Esc and by clicking the backdrop. */
  disableClose?: boolean;
}

/** Reference to a dialog opened by `useAppDialog().open()`. */
export interface AppDialogRef<R = unknown> {
  close(result?: R): void;
  /** Resolves with the result passed to `close()` (Angular: `dialogRef.closed`). */
  closed: Promise<R | undefined>;
}

export interface AppDialogService {
  open<R = unknown, D = unknown>(
    component: ComponentType,
    config: AppDialogConfig<D>,
  ): AppDialogRef<R>;
}

export const AppDialogServiceContext = createContext<AppDialogService | null>(null);

export interface DialogRefContextValue {
  close(result?: unknown): void;
  data: unknown;
}

export const DialogRefContext = createContext<DialogRefContextValue | null>(null);

/**
 * Equivalent of injecting `AppDialogService`.
 */
export const useAppDialog = (): AppDialogService => {
  const ctx = useContext(AppDialogServiceContext);

  if (!ctx) {
    throw new Error('useAppDialog must be used within <AppDialogProvider>');
  }

  return ctx;
};

/**
 * Equivalent of injecting `DialogRef` in the dialog content component.
 */
export const useDialogRef = <R = unknown>() => {
  const ctx = useContext(DialogRefContext);

  if (!ctx) {
    throw new Error('useDialogRef must be used inside a dialog opened by useAppDialog()');
  }

  return { close: (result?: R) => ctx.close(result) };
};

/**
 * Equivalent of injecting `DIALOG_DATA` in the dialog content component.
 */
export const useDialogData = <D>() => {
  const ctx = useContext(DialogRefContext);

  if (!ctx) {
    throw new Error('useDialogData must be used inside a dialog opened by useAppDialog()');
  }

  return ctx.data as D;
};
