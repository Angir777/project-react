import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Alert, AlertAction, AlertDescription } from '@/shadcn/components/ui/alert';
import { Button } from '@/shadcn/components/ui/button';

interface ErrorAlertProps {
  /** Translated message. */
  message: string;
  onClose: () => void;
}

/**
 * Destructive in-page error with a close button
 * (Angular: `<z-alert zType="destructive" [zDescription] [zAction]>` used by the auth forms).
 */
export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-5">
      <Alert variant="destructive">
        <div className="flex-1">
          <AlertDescription>{message}</AlertDescription>

          <AlertAction>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={t('main.global.button.close')}
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faXmark} />
            </Button>
          </AlertAction>
        </div>
      </Alert>
    </div>
  );
}
