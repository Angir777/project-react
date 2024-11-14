import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { setPageTitle } from '../../../utils/page-title.utils';
import { Button } from 'primereact/button';
import { DataTable, SortOrder } from 'primereact/datatable';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { TableDataInterface } from '../../../interfaces/table-data.interface';
import { InputSwitch } from 'primereact/inputswitch';
import UserService from '../../../services/user/user.service';
import { faArrowLeftLong, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'primereact/tooltip';
import { HasPermission } from '../../../core/auth/HasPermission';
import { User } from '../../../models/user/User';
import { toastActions } from '../../../core/redux/toast';
import { Column } from 'primereact/column';
import Swal from 'sweetalert2';
import moment from 'moment';
import './Users.scss';
import { goBack } from '../../../helpers/functions.helpers';

// Klucz w localStorage dla tabeli 'Użytkownicy'
const TABLE_STATE_KEY = 'usersDeletedTableState';

const DeleteUsersList: FC = () => {
  const dispatch = setGlobalState();
  const { t } = useTranslation();

  // Ustawienie title strony
  useEffect(() => {
    setPageTitle(t('users.title'));
  }, [t]);

  // Sprawdza czy dany użytkownik posiada rolę 'SUPER_ADMIN'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isSuperAdmin = (roles: any) => {
    if (roles.indexOf('SUPER_ADMIN') !== -1) {
      return true;
    } else {
      return false;
    }
  };

  // "Data usunięcia" - Sformatowanie i ujednolicenie daty wyświetlanej w tabeli
  const formatDate = (date: string) => {
    return moment.utc(date).format('DD-MM-YYYY HH:mm:ss');
  };

  // ---------------------------------------------------------------------------
  // USTAWIENIA KONKRETNEJ TABELI
  // ---------------------------------------------------------------------------

  // Kolumny tabeli obsługiwane przez filtry
  const defaultTableFilters = {
    id: { value: null, matchMode: 'startsWith' },
    name: { value: null, matchMode: 'startsWith' },
    email: { value: null, matchMode: 'startsWith' },
    deletedAt: { value: null, matchMode: 'startsWith' },
  };
  // Ładowanie ustawień tabeli
  const loadTableSettings = () => {
    const savedTableSettings = localStorage.getItem(TABLE_STATE_KEY);
    if (savedTableSettings) {
      const parsedSettings = JSON.parse(savedTableSettings);
      // Wartości zapisane w localstorage
      return {
        first: parsedSettings.first,
        rows: parsedSettings.rows,
        page: parsedSettings.page,
        sortField: parsedSettings.sortField,
        sortOrder: parsedSettings.sortOrder as SortOrder,
        filters: parsedSettings.filters || {},
      };
    } else {
      // Domyślne wartości, jeśli nie zapisano stanu
      return {
        first: 0,
        rows: 10,
        page: 1,
        sortField: 'id',
        sortOrder: -1 as SortOrder,
        filters: defaultTableFilters,
      };
    }
  };
  const [lazyState, setLazyState] = useState(loadTableSettings);

  // Pobranie danych dla tabeli
  const getTableData = useCallback(async () => {
    setIsLoading(true);

    try {
      let queryParams = {};

      if (saveTableStatus) {
        const parsedSettings = loadTableSettings();
        queryParams = {
          sort: prepareSortParams(parsedSettings.sortField, parsedSettings.sortOrder),
          page: parsedSettings.page,
          pageSize: parsedSettings.rows,
          ...prepareFilterParams(parsedSettings.filters),
        };
      } else {
        queryParams = {
          sort: prepareSortParams(lazyState.sortField, lazyState.sortOrder),
          page: lazyState.page,
          pageSize: lazyState.rows,
          ...prepareFilterParams(lazyState.filters),
        };
      }

      const response = await UserService.queryDeleted(queryParams);

      setTableData(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('ERROR:', error);
    }

    setIsLoading(false);
  }, [lazyState]);

  // Actions - akcje na tabelce
  const actionsBodyTemplate = (row: User) => {
    return (
      <>
        {isSuperAdmin(row.roles) ? (
          <>
            <HasPermission permissions={['SUPER_ADMIN', 'USER_MANAGE']}>
              <>
                {/* Przywrócenie */}
                <button className="btn btn-warning btn-sm mb-1" id={`restore-tooltip-${row.id}`} onClick={() => restoreUser(row)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <Tooltip target={`#restore-tooltip-${row.id}`} content={t('users.buttons.restore')} />
              </>
            </HasPermission>
          </>
        ) : (
          <>
            <HasPermission permissions={['USER_MANAGE']}>
              <>
                {/* Przywrócenie */}
                <button className="btn btn-warning btn-sm mb-1" id={`restore-tooltip-${row.id}`} onClick={() => restoreUser(row)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <Tooltip target={`#restore-tooltip-${row.id}`} content={t('users.buttons.restore')} />
              </>
            </HasPermission>
          </>
        )}
      </>
    );
  };

  // Przywrócenie użytkownika
  const restoreUser = useCallback(
    async (row: User) => {
      const result = await Swal.fire({
        icon: 'question',
        title: t('users.messages.questions.areYouSureToRestoreAccountText', { email: `${row.email}` }),
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: t('global.buttons.no'),
        confirmButtonText: t('global.buttons.yes'),
      });
      if (result.value && row.id) {
        setIsLoading(true);

        try {
          await UserService.restore(row.id);

          dispatch(
            toastActions.showToast({
              severity: 'success',
              summary: t('toast.summary.success'),
              detail: t('users.messages.success.restoredAccountSuccess'),
            })
          );

          // Odświeżenie tabeli po przywróceniu użytkownika
          refreshTable();
        } catch {
          dispatch(
            toastActions.showToast({
              severity: 'error',
              summary: t('toast.summary.error'),
              detail: t('users.messages.errors.cantRestoreAccount'),
            })
          );
        }

        setIsLoading(false);
      }
    },
    [t]
  );

  // Kolumna 'Data usuniecia' - formatowanie wyświetlanej daty
  const deletedAtBodyTemplate = (row: User) => {
    return row.deletedAt ? formatDate(row.deletedAt) : null;
  };

  // ---------------------------------------------------------------------------
  // STAŁE ELEMENTY TABELI
  // ---------------------------------------------------------------------------

  // Podstawowe zmienne dla tabeli
  const [isLoading, setIsLoading] = useState(false);
  const [tableData, setTableData] = useState<TableDataInterface | null>(null);

  // Ikony paginacji
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text />;

  // Flaga określająca czy ustawienia dla danej tabeli sa zapisywane
  const [saveTableStatus, setSaveTableStatus] = useState<boolean>(() => {
    // Pobieramy wartość z localStorage lub ustawiamy domyślnie na false
    const savedStatus = localStorage.getItem(TABLE_STATE_KEY + '_saveStatus');
    return savedStatus ? JSON.parse(savedStatus) : false;
  });

  // Table header - zapamiętywanie stanu tabeli
  const headerBodyTemplate = () => {
    return (
      <div className="d-flex justify-content-end">
        <InputSwitch
          checked={saveTableStatus}
          onChange={handleSaveTableStatusChange}
          className="small-input-switch"
          tooltip={t('global.table.saveTableStatus')}
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  // Obsługa przełącznika zapisywania ustawień tabeli
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveTableStatusChange = (e: any) => {
    const status = e.value;
    setSaveTableStatus(status);
    if (status) {
      // Zapis ustawienia flagi do localstorage
      localStorage.setItem(TABLE_STATE_KEY + '_saveStatus', JSON.stringify(true));
      // saveTableSettings();
    } else {
      // Wyczyszczenie flagi z localstorage
      localStorage.removeItem(TABLE_STATE_KEY + '_saveStatus');
      clearTableSettings();
    }
  };

  // Funkcja czyszcząca ustawienia z localStorage
  const clearTableSettings = useCallback(() => {
    localStorage.removeItem(TABLE_STATE_KEY);
  }, []);

  // Zapisuje stan tabeli do localStorage za każdym razem, gdy `lazyState` lub `saveTableStatus` zmieni się
  useEffect(() => {
    if (saveTableStatus) {
      const stateToSave = lazyState;
      localStorage.setItem(TABLE_STATE_KEY, JSON.stringify(stateToSave));
    }
  }, [lazyState, saveTableStatus]);

  // Funkcja odświeżająca dane tabelki
  const refreshTable = () => {
    getTableData();
  };

  // Wywołanie pobrania danych przy każdej zmianie lazyState
  useEffect(() => {
    getTableData();
  }, [lazyState, getTableData]);

  // Funkcja do przygotowania parametru sortowania
  const prepareSortParams = (sortField: string, sortOrder: SortOrder) => {
    return sortOrder === 1 ? sortField : `-${sortField}`;
  };

  // Funkcja do przygotowania filtrów jako oddzielnych parametrów zapytania
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prepareFilterParams = (filters: Record<string, any>) => {
    return Object.entries(filters).reduce(
      (acc, [key, filter]) => {
        if (filter && filter.value) {
          // Dodajemy parametry `filter[key] = value`
          acc[`filter[${key}]`] = Array.isArray(filter.value) ? filter.value.join(',') : filter.value;
        }
        return acc;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>
    );
  };

  // Zdarzenie paginacji
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPage = (event: any) => {
    setLazyState((prevState) => ({
      ...prevState,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    }));
  };

  // Zdarzenie sortowania
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSort = (event: any) => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: event.sortField,
      sortOrder: event.sortOrder,
    }));
  };

  // Zdarzenie filtrowania
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFilter = (event: any) => {
    setLazyState((prevState) => ({
      ...prevState,
      filters: event.filters,
    }));
  };

  // ---------------------------------------------------------------------------
  // RENDEROWANY WIDOK
  // ---------------------------------------------------------------------------

  return (
    <>
      <PageHeading
        title={t('users.title')}
        actionButtons={
          <>
            <button onClick={goBack} className="btn btn-secondary btn-sm ms-2">
              <FontAwesomeIcon icon={faArrowLeftLong} />
              <span className="ms-2">{t('global.buttons.back')}</span>
            </button>
          </>
        }
      />

      <PageContentWrapper>
        <div className="row">
          <div className="col-12">
            <DataTable
              value={tableData?.items}
              lazy
              filterDisplay="row"
              dataKey="id"
              loading={isLoading}
              first={lazyState.first}
              rows={lazyState.rows}
              rowsPerPageOptions={[5, 10, 25, 30, 50]}
              totalRecords={tableData?.totalCount}
              onPage={onPage}
              onSort={onSort}
              onFilter={onFilter}
              sortField={lazyState.sortField}
              sortOrder={lazyState.sortOrder}
              filters={lazyState.filters}
              paginator
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate={`${lazyState.first + 1} - ${Math.min(lazyState.first + lazyState.rows, tableData?.totalCount || 0)} ${t('global.table.ofPage')} ${tableData?.totalCount}`}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              size="small"
              header={headerBodyTemplate}>
              <Column 
                header={t('global.table.actions')} 
                style={{ width: '10%' }} 
                body={(rowData) => actionsBodyTemplate(rowData)}></Column>
              <Column
                field="id"
                header={t('global.table.id')}
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder={t('global.table.filter')}
                style={{ width: '20%' }}></Column>
              <Column
                field="name"
                header={t('users.table.name')}
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder={t('global.table.filter')}
                style={{ width: '25%' }}></Column>
              <Column
                field="email"
                header={t('users.table.email')}
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder={t('global.table.filter')}
                style={{ width: '25%' }}></Column>
              <Column
                field="deletedAt"
                header={t('users.table.deletedAt')}
                sortable
                filter
                showClearButton={false}
                showFilterMenu={false}
                filterPlaceholder={t('global.table.filter')}
                style={{ width: '20%' }}
                body={(rowData) => deletedAtBodyTemplate(rowData)}></Column>
            </DataTable>
          </div>
        </div>
      </PageContentWrapper>
    </>
  );
};
export default DeleteUsersList;
