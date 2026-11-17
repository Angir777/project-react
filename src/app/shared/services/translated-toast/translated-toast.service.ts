import i18next from 'i18next';
import { toast } from 'sonner';

export type ToastType = 'success' | 'error' | 'warn' | 'info';

const summaryMap: Record<ToastType, string> = {
  success: 'main.global.toast.success',
  error: 'main.global.toast.error',
  warn: 'main.global.toast.warning',
  info: 'main.global.toast.info',
};

/**
 * Standard toast:
 * toastService.show('error', 'auth.confirmAccount.messages.error.' + errorCode);
 *
 * Toast with extra parameters (display time, translation parameters):
 * toastService.show('error', 'user.message.error.cantDelete', 5000, { name: user.name });
 *
 * Toasts are rendered by `<Toaster>` placed in `app.tsx`.
 */
export const toastService = {
  show(
    type: ToastType, // Notification type
    detailKey: string, // Message content
    life = 3000, // Display time
    params: Record<string, unknown> = {},
  ) {
    const summary = i18next.t(summaryMap[type]);
    const options = {
      description: i18next.t(detailKey, params),
      duration: life,
    };

    switch (type) {
      case 'success':
        toast.success(summary, options);
        break;
      case 'error':
        toast.error(summary, options);
        break;
      case 'warn':
        toast.warning(summary, options);
        break;
      case 'info':
        toast.info(summary, options);
        break;
    }
  },
};
