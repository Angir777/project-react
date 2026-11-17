import type { ReactNode } from 'react';
import { cn } from '@/shadcn/lib/utils';

interface PageSectionProps {
  title: ReactNode;
  /** Action buttons rendered in the header and repeated in the footer (Angular: #actionsButtons). */
  actions?: ReactNode;
  children: ReactNode;
  bodyClassName?: string;
  footerClassName?: string;
}

/**
 * Page frame used by the administration views: header (title + actions), body and footer (actions).
 */
export function PageSection({
  title,
  actions,
  children,
  bodyClassName = 'p-6',
  footerClassName = 'px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-wrap items-center gap-2 sm:justify-end',
}: PageSectionProps) {
  return (
    <>
      <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h5>

          <div className="flex flex-wrap gap-2 sm:ml-auto">{actions}</div>
        </div>
      </div>

      <div className={bodyClassName}>{children}</div>

      <div className={cn(footerClassName)}>{actions}</div>
    </>
  );
}
