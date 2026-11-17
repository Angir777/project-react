import type { ComponentProps } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/shadcn/components/ui/input';
import { cn } from '@/shadcn/lib/utils';

interface PasswordInputProps extends Omit<ComponentProps<'input'>, 'type'> {
  /** Whether the password is visible. */
  visible: boolean;
  /** Show/hide toggle (`type="button"`). */
  onToggleVisibility: () => void;
}

/**
 * Password input with show/hide toggle used by the auth forms.
 */
export function PasswordInput({
  visible,
  onToggleVisibility,
  className,
  ...props
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        type={visible ? 'text' : 'password'}
        className={cn('w-full pr-10', className)}
        {...props}
      />

      <button
        type="button"
        onClick={onToggleVisibility}
        className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-black/80 dark:text-white/80"
      >
        <FontAwesomeIcon icon={visible ? faEye : faEyeSlash} />
      </button>
    </div>
  );
}
