import { useState, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Maximize2, Minimize2, X } from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';
import { DialogRefContext, type AppDialogConfig } from './dialog.context';

export const APP_DIALOG_MAX_WIDTH = '95vw';
export const APP_DIALOG_MAX_HEIGHT = '95dvh';

interface AppDialogShellProps {
  component: ComponentType;
  config: AppDialogConfig<unknown>;
  open: boolean;
  onClose: (result?: unknown) => void;
}

/**
 * Dialog frame: header (title, maximize, close) and content.
 * The content component uses `useDialogRef()` and `useDialogData()`.
 */
export function AppDialogShell({
  component: Component,
  config,
  open,
  onClose,
}: AppDialogShellProps) {
  const { t } = useTranslation();
  const [maximized, setMaximized] = useState(false);

  const width = config.width ?? '600px';
  const disableClose = config.disableClose ?? false;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onEscapeKeyDown={(e) => disableClose && e.preventDefault()}
          onPointerDownOutside={(e) => disableClose && e.preventDefault()}
          onInteractOutside={(e) => disableClose && e.preventDefault()}
          className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          style={
            maximized
              ? { width: '100vw', height: '100dvh', maxWidth: '100vw', maxHeight: '100dvh' }
              : { width, maxWidth: APP_DIALOG_MAX_WIDTH, maxHeight: APP_DIALOG_MAX_HEIGHT }
          }
        >
          <div
            className={cn(
              'flex h-full max-h-[inherit] flex-col overflow-hidden bg-background text-foreground shadow-lg',
              maximized ? 'rounded-none' : 'rounded-xl border border-border',
            )}
          >
            <header className="flex shrink-0 items-center gap-2 px-6 pt-5 pb-3">
              <DialogPrimitive.Title className="text-lg leading-none font-semibold mb-0">
                {t(config.title)}
              </DialogPrimitive.Title>

              <div className="ml-auto flex items-center gap-1">
                {config.maximizable && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t(
                      maximized ? 'main.global.button.restore' : 'main.global.button.maximize',
                    )}
                    aria-pressed={maximized}
                    onClick={() => setMaximized((value) => !value)}
                  >
                    {maximized ? <Minimize2 /> : <Maximize2 />}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('main.global.button.close')}
                  onClick={() => onClose()}
                >
                  <X />
                </Button>
              </div>
            </header>

            <div className="min-h-0 flex-1 overflow-auto px-6 pb-6">
              <DialogRefContext.Provider value={{ close: onClose, data: config.data }}>
                <Component />
              </DialogRefContext.Provider>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
