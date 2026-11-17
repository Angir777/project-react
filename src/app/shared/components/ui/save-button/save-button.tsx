import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/shadcn/lib/utils';

/**
 * OPTIONAL: Usage options
 *
 * Submit (form)
 * <SaveButton type="submit" loading={isSaving} preview={inPreview} />
 *
 * Normal button + lg + click
 * <SaveButton size="lg" type="button" loading={isSaving} onClick={save} />
 */

interface SaveButtonProps {
  loading?: boolean;
  preview?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit';
  disabled?: boolean;
  form?: string;
  label?: string;
  onClick?: () => void;
}

const sizeClasses: Record<NonNullable<SaveButtonProps['size']>, string> = {
  lg: 'px-5 py-3 text-base',
  md: 'px-4 py-2 text-sm',
  sm: 'px-3 py-1.5 text-sm',
};

export function SaveButton({
  loading = false,
  preview = false,
  size = 'sm',
  type = 'submit',
  disabled = false,
  form,
  label = 'main.global.button.save',
  onClick,
}: SaveButtonProps) {
  const { t } = useTranslation();

  if (preview) {
    return null;
  }

  const handleClick = (event: MouseEvent) => {
    if (type === 'button') {
      event.preventDefault();
    }

    if (!disabled && !loading) {
      onClick?.();
    }
  };

  return (
    <button
      type={type}
      form={form}
      disabled={disabled || loading}
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition cursor-pointer dark:border-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-800',
        sizeClasses[size],
      )}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
      ) : (
        <FontAwesomeIcon icon={faFloppyDisk} className="text-sm" />
      )}

      <span>{t(label)}</span>
    </button>
  );
}
