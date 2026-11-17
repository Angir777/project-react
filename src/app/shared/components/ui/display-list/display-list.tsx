import type { ReactNode } from 'react';
import { cn } from '@/shadcn/lib/utils';

/**
 * Description list card used by the "display" views.
 */
export function DisplayList({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-800">
      <dl className="divide-y divide-gray-200 dark:divide-zinc-800">{children}</dl>
    </div>
  );
}

interface DisplayRowProps {
  label: ReactNode;
  /** Value without the default text styles (badges, custom content). */
  plain?: boolean;
  children: ReactNode;
}

export function DisplayRow({ label, plain = false, children }: DisplayRowProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 px-6 py-4 sm:grid-cols-12',
        plain ? 'gap-y-2 sm:gap-x-2' : 'gap-2',
      )}
    >
      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 sm:col-span-2">
        {label}
      </dt>

      <dd className={cn('sm:col-span-10', !plain && 'text-sm text-gray-900 dark:text-white/90')}>
        {children}
      </dd>
    </div>
  );
}

/**
 * Rounded gray badge (roles / permissions).
 */
export function PillBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-zinc-800 dark:text-gray-300">
      {children}
    </span>
  );
}
