import type { CSSProperties, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Switch } from '@/shadcn/components/ui/switch';
import { Input } from '@/shadcn/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { cn } from '@/shadcn/lib/utils';
import { Loader } from '../ui/loader/loader';
import { TableColumnSelector } from '../ui/table-column-selector/table-column-selector';
import type { MatTableState } from './use-mat-table';

/**
 * Column definition (Angular: `<ng-container matColumnDef>` with header and cell templates).
 */
export interface MatColumnDef<T> {
  header?: ReactNode;
  cell: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  style?: CSSProperties;
}

interface MatTableProps<T> {
  table: MatTableState<T>;
  columns: Record<string, MatColumnDef<T>>;
  rowKey: (row: T) => string | number;
}

/**
 * Table with loading overlay and paginator
 * (Angular: `mat-table` + `matSort` + `mat-paginator` used in the list components).
 */
export function MatTable<T>({ table, columns, rowKey }: MatTableProps<T>) {
  const { displayedColumns, isLoadingResults, data } = table;

  return (
    <div className="mat-table-wrapper relative overflow-hidden rounded-md">
      {isLoadingResults && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/10 backdrop-blur-xl">
          <Loader isLoading={true} />
        </div>
      )}

      <div
        className={cn(
          'overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800 transition-all duration-300',
          isLoadingResults && 'blur-sm opacity-60',
        )}
      >
        <table className="w-full border-collapse text-sm text-foreground/87 dark:text-white">
          <thead>
            <tr className="h-14">
              {displayedColumns.map((column) => (
                <th
                  key={column}
                  className={cn(
                    'border-b border-black/12 px-4 text-left align-middle font-medium dark:border-zinc-800',
                    columns[column]?.headerClassName,
                  )}
                  style={columns[column]?.style}
                >
                  {columns[column]?.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={rowKey(row)}
                className="h-[52px] hover:bg-gray-50 transition dark:hover:bg-zinc-800/40"
              >
                {displayedColumns.map((column) => (
                  <td
                    key={column}
                    className={cn(
                      'border-b border-black/12 px-4 align-middle dark:border-zinc-800',
                      columns[column]?.cellClassName,
                    )}
                    style={columns[column]?.style}
                  >
                    {columns[column]?.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginator */}
      <div
        className={cn(
          'flex justify-end mt-4 transition-all duration-300',
          isLoadingResults && 'blur-sm opacity-60',
        )}
      >
        <MatPaginator table={table} />
      </div>
    </div>
  );
}

interface MatSortHeaderProps<T> {
  table: MatTableState<T>;
  /** Sorted column (Angular: `mat-sort-header="id"`). */
  id: string;
  htmlFor?: string;
  children: ReactNode;
}

/**
 * Sortable header label (Angular: `<label mat-sort-header disableClear>`).
 */
export function MatSortHeader<T>({ table, id, htmlFor, children }: MatSortHeaderProps<T>) {
  const isActive = table.sort.active === id && table.sort.direction !== '';
  const direction = isActive ? table.sort.direction : 'asc';

  return (
    <label
      htmlFor={htmlFor}
      onClick={(event) => {
        event.preventDefault();
        table.setSort(id);
      }}
      className="group/sort inline-flex w-fit cursor-pointer items-center gap-1 font-medium text-gray-700 select-none dark:text-gray-200"
      aria-sort={isActive ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      {children}
      <ArrowUp
        strokeWidth={2.75}
        className={cn(
          'size-4 shrink-0 transition-all duration-200 text-foreground dark:text-zinc-500',
          direction === 'desc' && 'rotate-180',
          isActive ? 'opacity-100' : 'opacity-0 group-hover/sort:opacity-54',
        )}
      />
    </label>
  );
}

interface MatFilterHeaderProps<T> {
  table: MatTableState<T>;
  /** Column / sort id. */
  id: string;
  /** Label translation key. */
  label: string;
  /** Whether the column is sortable (default true). */
  sortable?: boolean;
  /** Disables the filter input. */
  filterDisabled?: boolean;
  /** Extra controls rendered next to the label (e.g. checkboxes). */
  labelExtra?: ReactNode;
}

/**
 * Column header with sortable label and text filter bound to `criteria['filter[<id>]']`
 * (Angular: `<label mat-sort-header>` + `<input z-input [(ngModel)]="criteria[...]" (keyup)="search()">`).
 */
export function MatFilterHeader<T>({
  table,
  id,
  label,
  sortable = true,
  filterDisabled = false,
  labelExtra,
}: MatFilterHeaderProps<T>) {
  const { t } = useTranslation();
  const filterKey = `filter[${id}]`;
  const inputId = `${id}Filter`;

  const labelElement = sortable ? (
    <MatSortHeader table={table} id={id} htmlFor={inputId}>
      {t(label)}
    </MatSortHeader>
  ) : (
    <label htmlFor={inputId} className="font-medium text-gray-700 dark:text-gray-200">
      {t(label)}
    </label>
  );

  return (
    <div className="flex flex-col gap-2 pt-3 pb-3">
      {labelExtra ? (
        <div className="flex items-center justify-between gap-2">
          {labelElement}
          {labelExtra}
        </div>
      ) : (
        labelElement
      )}

      <Input
        id={inputId}
        type="text"
        autoComplete="off"
        disabled={filterDisabled}
        value={String(table.criteria[filterKey] ?? '')}
        onChange={(event) => table.setCriteria({ [filterKey]: event.target.value })}
        onKeyUp={() => table.search()}
      />
    </div>
  );
}

/**
 * Paginator (Angular: `mat-paginator` with `CustomPaginatorIntlHelper` labels).
 */
export function MatPaginator<T>({ table }: { table: MatTableState<T> }) {
  const { t } = useTranslation();
  const { pageIndex, pageSize, pageSizeOptions, resultsLength: length, onPageChange } = table;

  const numberOfPages = pageSize > 0 ? Math.ceil(length / pageSize) : 0;
  const hasPrevious = pageIndex >= 1 && pageSize !== 0;
  const hasNext = pageIndex < numberOfPages - 1 && pageSize !== 0;

  const getRangeLabel = () => {
    if (length === 0 || pageSize === 0) {
      return `0 ${t('paginator.of')} ${length}`;
    }

    const startIndex = pageIndex * pageSize;
    const endIndex =
      startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    return `${startIndex + 1} – ${endIndex} ${t('main.paginator.of')} ${length}`;
  };

  const goTo = (index: number) => onPageChange({ pageIndex: index, pageSize });

  const navButton =
    'mx-1 inline-flex size-10 cursor-pointer items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-black/5 disabled:cursor-default disabled:opacity-38 disabled:hover:bg-transparent dark:text-white dark:hover:bg-white/10';

  return (
    <div className="flex min-h-14 flex-wrap items-center justify-end gap-x-2 px-2 text-xs text-foreground/70 dark:text-white">
      <div className="flex items-center gap-2">
        <span>{t('main.paginator.itemsPerPage')}</span>

        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageChange({ pageIndex, pageSize: Number(value) })}
        >
          <SelectTrigger
            className="h-10! w-[84px] cursor-pointer rounded-[4px] border-gray-400 px-4 text-xs shadow-none dark:border-zinc-800 [&_svg:not([class*='text-'])]:text-foreground/70"
            aria-label={t('main.paginator.itemsPerPage')}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {pageSizeOptions.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="ml-6 mr-8">{getRangeLabel()}</div>

      <div className="flex items-center">
        <button
          type="button"
          className={navButton}
          disabled={!hasPrevious}
          aria-label={t('main.paginator.firstPage')}
          title={t('main.paginator.firstPage')}
          onClick={() => goTo(0)}
        >
          <ChevronFirst className="size-5" />
        </button>
        <button
          type="button"
          className={navButton}
          disabled={!hasPrevious}
          aria-label={t('main.paginator.previousPage')}
          title={t('main.paginator.previousPage')}
          onClick={() => goTo(pageIndex - 1)}
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          className={navButton}
          disabled={!hasNext}
          aria-label={t('main.paginator.nextPage')}
          title={t('main.paginator.nextPage')}
          onClick={() => goTo(pageIndex + 1)}
        >
          <ChevronRight className="size-5" />
        </button>
        <button
          type="button"
          className={navButton}
          disabled={!hasNext}
          aria-label={t('main.paginator.lastPage')}
          title={t('main.paginator.lastPage')}
          onClick={() => goTo(numberOfPages - 1)}
        >
          <ChevronLast className="size-5" />
        </button>
      </div>
    </div>
  );
}

interface MatTableToolbarProps<T> {
  table: MatTableState<T>;
  allColumns: string[];
  columnTranslations: Record<string, string>;
}

/**
 * "Show/hide columns" + "Remember state" row shown above every list table.
 */
export function MatTableToolbar<T>({
  table,
  allColumns,
  columnTranslations,
}: MatTableToolbarProps<T>) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap mb-5">
      <div className="w-1/2 flex justify-start items-center">
        <TableColumnSelector
          allColumns={allColumns}
          columnTranslations={columnTranslations}
          selectedColumns={table.displayedColumns}
          onSelectedColumnsChange={table.setDisplayedColumns}
        />
      </div>

      <div className="w-1/2 flex justify-end items-center">
        {table.canChangeSaveState && (
          <div className="px-2 flex items-center gap-2">
            <small className="text-sm text-gray-600 dark:text-white/90">
              {t('main.global.saveState')}
            </small>

            <Switch checked={table.saveState} onCheckedChange={table.setSaveState} />
          </div>
        )}
      </div>
    </div>
  );
}
