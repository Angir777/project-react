import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/ui/tooltip';

const actionClasses =
  'inline-flex size-9 items-center justify-center rounded-full border border-gray-300 bg-transparent text-gray-600 shadow-sm transition-colors hover:bg-gray-100 dark:border-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-800 cursor-pointer';

interface TableActionButtonProps {
  /** Tooltip translation key (Angular: matTooltip, position above). */
  tooltip: string;
  /** Router link; when omitted a button is rendered. */
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
}

/**
 * Round icon button used in the "actions" column of the list tables.
 */
export function TableActionButton({
  tooltip,
  to,
  onClick,
  disabled,
  children,
}: TableActionButtonProps) {
  const { t } = useTranslation();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {to ? (
          <Link to={to} className={actionClasses}>
            {children}
          </Link>
        ) : (
          <button type="button" className={actionClasses} onClick={onClick} disabled={disabled}>
            {children}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent side="top">{t(tooltip)}</TooltipContent>
    </Tooltip>
  );
}
