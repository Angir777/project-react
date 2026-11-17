import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popover, PopoverContent, PopoverTrigger } from '@/shadcn/components/ui/popover';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { cn } from '@/shadcn/lib/utils';

interface TableColumnSelectorProps {
  allColumns: string[];
  columnTranslations: Record<string, string>;
  selectedColumns: string[];
  onSelectedColumnsChange: (columns: string[]) => void;
}

/**
 * Multi-select of visible table columns (Angular: ng-select multiple, not clearable,
 * not searchable, closeOnSelect=false, with a "hidden columns: N" label).
 */
export function TableColumnSelector({
  allColumns,
  columnTranslations,
  selectedColumns,
  onSelectedColumnsChange,
}: TableColumnSelectorProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const toggleColumn = (column: string) => {
    const columns = selectedColumns.includes(column)
      ? selectedColumns.filter((c) => c !== column)
      : [...selectedColumns, column];

    const orderedColumns = allColumns.filter((c) => columns.includes(c));

    onSelectedColumnsChange(orderedColumns);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'relative flex h-9 w-[220px] cursor-pointer items-center justify-between rounded-[4px] border border-[#ccc] bg-background px-2.5 text-base text-foreground dark:border-zinc-800 outline-none',
            open &&
              'border-ring shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_50%,transparent)]',
          )}
        >
          <span className="pointer-events-none whitespace-nowrap">
            {t('main.global.hiddenColumnsAmount')}: {allColumns.length - selectedColumns.length}
          </span>
          <span className="inline-block h-0 w-0 border-x-[5px] border-t-[5px] border-b-[2.5px] border-x-transparent border-t-[#999] border-b-transparent" />
        </button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={2} className="w-[220px] p-0">
        <div role="listbox" aria-multiselectable="true" className="max-h-60 overflow-y-auto py-1">
          {allColumns.map((column) => {
            const isSelected = selectedColumns.includes(column);

            return (
              <button
                key={column}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => toggleColumn(column)}
                className="grid w-full cursor-pointer grid-cols-[16px_minmax(0,1fr)] items-center gap-x-2 px-2.5 py-2 text-left text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Checkbox checked={isSelected} tabIndex={-1} className="pointer-events-none" />

                <span className="col-start-2 min-w-0 whitespace-normal wrap-anywhere">
                  {t(columnTranslations[column])}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
