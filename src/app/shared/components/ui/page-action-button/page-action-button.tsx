import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/ui/tooltip';

interface PageActionButtonProps {
  /** Router link (Angular: `[routerLink]` on a button). */
  to?: string;
  onClick?: () => void;
  icon: ReactNode;
  /** Label translation key (visible from `lg`). */
  label: string;
  /** Tooltip translation key shown on mobile view (Angular: matTooltip with isMobileView). */
  tooltip?: string;
  isMobileView?: boolean;
}

/**
 * Header action button of the list pages (Add / Deleted ...).
 */
export function PageActionButton({
  to,
  onClick,
  icon,
  label,
  tooltip,
  isMobileView = false,
}: PageActionButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const button = (
    <button
      type="button"
      onClick={() => (to ? navigate(to) : onClick?.())}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition cursor-pointer dark:border-zinc-800 dark:text-gray-200 dark:hover:bg-zinc-800"
    >
      {icon}
      <span className="hidden lg:inline">{t(label)}</span>
    </button>
  );

  if (!isMobileView) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="top">{t(tooltip ?? label)}</TooltipContent>
    </Tooltip>
  );
}
