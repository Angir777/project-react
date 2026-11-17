import { useCallback, useEffect, useRef, useState } from 'react';
import type { AxiosResponse } from 'axios';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { environment } from '@environments';
import type { PaginatedResponse } from '../../interfaces';
import { prepareSortParams, type RequestParams } from '../../utils';
import { toastService } from '../../services/translated-toast/translated-toast.service';
import { useMediaQuery } from '../../hooks/use-media-query';

export type FilterValue = string | number | boolean | (string | number)[];
export type FilterParams = Record<string, FilterValue>;
export type SortDirection = 'asc' | 'desc' | '';

export interface SortState {
  active: string;
  direction: SortDirection;
}

interface TableState {
  saveState?: boolean;
  pageSize?: number;
  pageIndex?: number;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  criteria?: FilterParams;
  displayedColumns?: string[];
}

export interface UseMatTableOptions<T> {
  /** Key under which the table configuration is stored (`${storageKey}-state-table`). */
  storageKey: string;
  /** Endpoint used to read the data (Angular: `fetchMethod`, default `dataService.query`). */
  fetchMethod: (req?: RequestParams) => Promise<AxiosResponse<PaginatedResponse<T>>>;
  /** Initially displayed columns. */
  displayedColumns: string[];
  /** Initial sort (Angular: matSortActive / matSortDirection). */
  defaultSort?: SortState;
  /** Extra request parameters. */
  appendedCriteria?: RequestParams;
}

const readTableState = (key: string): TableState | null => {
  const tableState = localStorage.getItem(key);

  if (tableState == null) {
    return null;
  }

  // Remove the current table settings.
  localStorage.removeItem(key);

  try {
    return JSON.parse(tableState) as TableState;
  } catch {
    return null;
  }
};

/**
 * Equivalent of the Angular `BaseMatTableQueryComponent` + `MatTableComponent<T>`:
 * server-side pagination, sorting, debounced column filters, column visibility
 * and the optional "remember table state" stored in localStorage.
 */
export function useMatTable<T>({
  storageKey,
  fetchMethod,
  displayedColumns: initialColumns,
  defaultSort = { active: 'id', direction: 'desc' },
  appendedCriteria = {},
}: UseMatTableOptions<T>) {
  const localStorageSavedStateKey = `${storageKey}-state-table`;

  // Restore the table state from local storage (read once, then removed).
  const [restoredState] = useState(() => readTableState(localStorageSavedStateKey));

  // Initial paginator values.
  const pageSizeOptions = environment.PAGE_SIZES;

  const [pageSize, setPageSize] = useState(
    restoredState?.pageSize ?? environment.DEFAULT_PAGE_SIZE,
  );
  const [pageIndex, setPageIndex] = useState(restoredState?.pageIndex ?? 0);
  const [sort, setSortState] = useState<SortState>({
    active: restoredState?.sortColumn ?? defaultSort.active,
    direction: restoredState?.sortDirection ?? defaultSort.direction,
  });

  // Filter criteria for individual columns.
  const [criteria, setCriteriaState] = useState<FilterParams>(restoredState?.criteria ?? {});
  const criteriaRef = useRef(criteria);

  // Displayed columns.
  const [displayedColumns, setDisplayedColumns] = useState<string[]>(
    restoredState?.displayedColumns ?? initialColumns,
  );

  // Should settings be saved in localStorage?
  const [saveState, setSaveState] = useState(restoredState?.saveState ?? false);

  // Is the "Remember state" switch visible? (Angular: enabled in ngOnInit)
  const canChangeSaveState = true;

  // Refresh trigger (Angular: filterSubject$).
  const [refreshKey, setRefreshKey] = useState(0);

  const isMobileView = useMediaQuery('(max-width: 1023px)');

  /**
   * State persistence
   */

  const stateRef = useRef({ saveState, pageSize, pageIndex, sort, displayedColumns });

  useEffect(() => {
    stateRef.current = { saveState, pageSize, pageIndex, sort, displayedColumns };
  }, [saveState, pageSize, pageIndex, sort, displayedColumns]);

  const persistState = useCallback(() => {
    const state = stateRef.current;

    if (!state.saveState) {
      return;
    }

    localStorage.setItem(
      localStorageSavedStateKey,
      JSON.stringify({
        saveState: state.saveState,
        pageSize: state.pageSize,
        pageIndex: state.pageIndex,
        sortColumn: state.sort.active,
        sortDirection: state.sort.direction,
        criteria: criteriaRef.current,
        displayedColumns: state.displayedColumns,
      }),
    );
  }, [localStorageSavedStateKey]);

  useEffect(() => {
    window.addEventListener('beforeunload', persistState);

    return () => {
      window.removeEventListener('beforeunload', persistState);
      persistState();
    };
  }, [persistState]);

  /**
   * Filtering
   */

  // Reset pagination settings.
  const resetPaginator = useCallback(() => setPageIndex(0), []);

  // Refresh the table.
  const refreshTable = useCallback(() => setRefreshKey((key) => key + 1), []);

  // Update criteria (Angular: [(ngModel)]="criteria['filter[x]']").
  const setCriteria = useCallback((patch: FilterParams) => {
    criteriaRef.current = { ...criteriaRef.current, ...patch };
    setCriteriaState(criteriaRef.current);
  }, []);

  const lastEmittedCriteria = useRef<string | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search using an input field (debounceTime(500) + distinctUntilChanged).
  const search = useCallback(() => {
    const currentCriteria = JSON.stringify({ ...criteriaRef.current });

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (lastEmittedCriteria.current === currentCriteria) {
        return;
      }

      lastEmittedCriteria.current = currentCriteria;
      resetPaginator();
      refreshTable();
    }, 500);
  }, [refreshTable, resetPaginator]);

  useEffect(
    () => () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    },
    [],
  );

  // Search using a select field.
  const onFilterSelect = useCallback(() => {
    resetPaginator();
    refreshTable();
  }, [refreshTable, resetPaginator]);

  /**
   * Sorting & paging
   */

  // If the user changes the sort order, go back to the first page.
  const setSort = useCallback(
    (active: string) => {
      setSortState((current) => {
        if (current.active !== active) {
          return { active, direction: 'asc' };
        }
        // matSortDisableClear: toggle between asc and desc only.
        return { active, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      });
      resetPaginator();
    },
    [resetPaginator],
  );

  // Reset sorting.
  const resetSort = useCallback((active: string, direction: SortDirection) => {
    setSortState({ active, direction });
  }, []);

  const onPageChange = useCallback(
    (event: { pageIndex: number; pageSize: number }) => {
      if (event.pageSize !== pageSize) {
        // Keep the first visible item on the page (mat-paginator behaviour).
        const startIndex = pageIndex * pageSize;
        setPageIndex(Math.floor(startIndex / event.pageSize));
        setPageSize(event.pageSize);
        return;
      }

      setPageIndex(event.pageIndex);
    },
    [pageIndex, pageSize],
  );

  /**
   * Data
   */

  const query = useQuery({
    queryKey: [storageKey, 'mat-table', pageIndex, pageSize, sort, refreshKey, appendedCriteria],
    queryFn: async () => {
      const res = await fetchMethod({
        sort: prepareSortParams(sort.active, sort.direction),
        page: pageIndex + 1,
        pageSize: pageSize,
        ...criteriaRef.current,
        ...appendedCriteria,
      });

      return res.data;
    },
    placeholderData: keepPreviousData,
    retry: false,
    refetchOnWindowFocus: false,
    gcTime: 0,
  });

  useEffect(() => {
    if (query.isError) {
      toastService.show('error', 'main.global.message.error.cantGetData');
    }
  }, [query.isError, query.errorUpdatedAt]);

  // Number of records (the last successful response is kept on error).
  const resultsLength = query.data?.total ?? 0;

  const data: T[] = query.isError ? [] : (query.data?.data ?? []);

  return {
    // Data
    data,
    resultsLength,
    isLoadingResults: query.isFetching,

    // Filtering
    criteria,
    setCriteria,
    search,
    onFilterSelect,
    refreshTable,

    // Sorting
    sort,
    setSort,
    resetSort,

    // Paging
    pageIndex,
    pageSize,
    pageSizeOptions,
    onPageChange,

    // Columns
    displayedColumns,
    setDisplayedColumns,

    // Remember state
    saveState,
    setSaveState,
    canChangeSaveState,

    isMobileView,
  };
}

export type MatTableState<T> = ReturnType<typeof useMatTable<T>>;
