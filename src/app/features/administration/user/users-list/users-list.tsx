import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClockRotateLeft,
  faEye,
  faGears,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTrashCan,
  faUser,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/ui/tooltip';
import { HasPermission } from '@/shared/components/has-permission/has-permission';
import {
  MatFilterHeader,
  MatTable,
  MatTableToolbar,
  type MatColumnDef,
} from '@/shared/components/mat-table/mat-table';
import { TableActionButton } from '@/shared/components/mat-table/table-action-button';
import { useMatTable } from '@/shared/components/mat-table/use-mat-table';
import { useAppDialog } from '@/shared/components/ui/dialog/dialog.context';
import { MultiSelect } from '@/shared/components/ui/multi-select/multi-select';
import { PageActionButton } from '@/shared/components/ui/page-action-button/page-action-button';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import type { Permission, Role, User } from '@/shared/interfaces';
import { roleService, toastService, translatedSwalService, userService } from '@/shared/services';
import { formatDate } from '@/shared/utils';
import { AttachRoleModal } from '../../components/attach-role-modal/attach-role-modal';
import { UserHistoryModal } from '../../components/user-history-modal/user-history-modal';

// Table columns
const displayedColumns = ['actions', 'id', 'fullName', 'email', 'emailVerifiedAt'];

// Column translations for 'Show/hide columns'
const columnTranslations: Record<string, string> = {
  actions: 'main.global.actions',
  id: 'main.global.id',
  fullName: 'user.form.fullName',
  email: 'user.form.email',
  emailVerifiedAt: 'user.form.emailVerifiedAt',
};

// All table columns (Show/hide columns)
const allColumns = displayedColumns;

export function UsersList() {
  const { t } = useTranslation();
  const dialogService = useAppDialog();

  const table = useMatTable<User>({
    storageKey: 'user',
    fetchMethod: userService.query,
    displayedColumns,
  });

  // Additional filters
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  // Rows being deleted (Angular: row.isDeleting)
  const [deletingIds, setDeletingIds] = useState<User['id'][]>([]);

  /**
   * Load the required dictionaries
   */
  useEffect(() => {
    roleService
      .getAll()
      .then((res) => setRoles(res.data ?? []))
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoadingRoles(false));

    roleService
      .getPermissions()
      .then((res) => setPermissions(res ?? []))
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoadingPermissions(false));
  }, []);

  /**
   * Actions
   */

  // Change history modal
  const openHistoryModal = async (user: User) => {
    const ref = dialogService.open<boolean>(UserHistoryModal, {
      title: 'main.global.history.title',
      width: '1000px',
      maximizable: true,
      data: { id: user.id },
    });

    if (await ref.closed) {
      table.refreshTable();
    }
  };

  // Edit role assignment
  const openAddRoleModal = async (user: User) => {
    const ref = dialogService.open<boolean>(AttachRoleModal, {
      title: 'user.form.role',
      width: '800px',
      maximizable: true,
      data: { user },
    });

    if (await ref.closed) {
      table.refreshTable();
    }
  };

  // Deletion
  const deleteUser = async (user: User) => {
    const result = await translatedSwalService.showAsync(
      'user.message.question.areYouSureYouWantDelete',
      {
        name: user.fullName,
      },
      {
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonTextTranslation: 'main.global.yes',
        cancelButtonTextTranslation: 'main.global.no',
      },
    );

    if (result.value) {
      setDeletingIds((ids) => [...ids, user.id]);

      try {
        await userService.delete(user.id);

        void translatedSwalService.show('success', 'user.message.success.deletedSuccessfully', {
          name: user.fullName,
        });
        table.refreshTable();
      } catch {
        void translatedSwalService.show('error', 'user.message.error.cantDeleted', {
          name: user.fullName,
        });
      } finally {
        setDeletingIds((ids) => ids.filter((id) => id !== user.id));
      }
    }
  };

  /**
   * Helper functions
   */

  // Toggle checkboxes for additional filters
  const onEmailVerifiedFilterChange = (type: 'no' | 'yes', checked: boolean) => {
    if (type === 'no') {
      table.setCriteria({
        'filter[emailVerifiedAtNo]': checked,
        ...(checked ? { 'filter[emailVerifiedAtYes]': false } : {}),
      });
    }

    if (type === 'yes') {
      table.setCriteria({
        'filter[emailVerifiedAtYes]': checked,
        ...(checked ? { 'filter[emailVerifiedAtNo]': false } : {}),
      });
    }

    table.search();
  };

  const emailVerifiedCheckbox = (type: 'no' | 'yes') => {
    const key = type === 'no' ? 'filter[emailVerifiedAtNo]' : 'filter[emailVerifiedAtYes]';

    return (
      <div className="flex items-center gap-1">
        <FontAwesomeIcon
          icon={type === 'no' ? faUserSlash : faUser}
          className="text-sm text-gray-800 dark:text-gray-200"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Checkbox
              id={type === 'no' ? 'emailVerifiedAtNo' : 'emailVerifiedAtYes'}
              checked={table.criteria[key] === true}
              onCheckedChange={(checked) => onEmailVerifiedFilterChange(type, checked === true)}
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {t(type === 'no' ? 'user.form.emailVerifiedAtNo' : 'user.form.emailVerifiedAtYes')}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const columns: Record<string, MatColumnDef<User>> = {
    // Actions
    actions: {
      cell: (row) => (
        <div className="flex items-center gap-1">
          {/* View change history */}
          <TableActionButton
            tooltip="main.global.tooltip.history"
            onClick={() => openHistoryModal(row)}
          >
            <FontAwesomeIcon icon={faClockRotateLeft} className="text-sm" />
          </TableActionButton>

          {/* View */}
          <TableActionButton tooltip="main.global.tooltip.show" to={`display/${row.id}`}>
            <FontAwesomeIcon icon={faEye} className="text-sm" />
          </TableActionButton>

          {/* Edit */}
          <HasPermission only={['USERS_UPDATE']}>
            <TableActionButton tooltip="main.global.tooltip.edit" to={`edit/${row.id}`}>
              <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
            </TableActionButton>
          </HasPermission>

          {/* Role */}
          <HasPermission only={['USERS_UPDATE']}>
            <TableActionButton tooltip="user.form.role" onClick={() => openAddRoleModal(row)}>
              <FontAwesomeIcon icon={faGears} className="text-sm" />
            </TableActionButton>
          </HasPermission>

          {/* Delete */}
          <HasPermission only={['USERS_DELETE']}>
            <TableActionButton tooltip="main.global.tooltip.delete" onClick={() => deleteUser(row)}>
              {deletingIds.includes(row.id) ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
              ) : (
                <FontAwesomeIcon icon={faTrashCan} className="text-sm" />
              )}
            </TableActionButton>
          </HasPermission>
        </div>
      ),
    },

    // ID
    id: {
      header: <MatFilterHeader table={table} id="id" label="main.global.id" />,
      cell: (row) => row.id,
    },

    // Full name
    fullName: {
      header: <MatFilterHeader table={table} id="fullName" label="user.form.fullName" />,
      cell: (row) => row.fullName,
    },

    // Email
    email: {
      header: <MatFilterHeader table={table} id="email" label="user.form.email" />,
      cell: (row) => row.email,
    },

    // Account verification date
    emailVerifiedAt: {
      header: (
        <MatFilterHeader
          table={table}
          id="emailVerifiedAt"
          label="user.form.emailVerifiedAt"
          labelExtra={
            <>
              {/* Unverified accounts only */}
              {emailVerifiedCheckbox('no')}

              {/* Verified accounts only */}
              {emailVerifiedCheckbox('yes')}
            </>
          }
        />
      ),
      cell: (row) =>
        row.emailVerifiedAt ? (
          formatDate(row.emailVerifiedAt)
        ) : (
          <span className="text-sm text-gray-400 italic dark:text-gray-500">
            {t('user.form.emailNoVerified')}
          </span>
        ),
    },
  };

  const actionsButtons = (
    <>
      {/* Add */}
      <HasPermission only={['USERS_CREATE']}>
        <PageActionButton
          to="add"
          icon={<FontAwesomeIcon icon={faPlus} />}
          label="main.global.button.add"
          isMobileView={table.isMobileView}
        />
      </HasPermission>
      {/* Deleted items */}
      <HasPermission only={['USERS_CREATE']}>
        <PageActionButton
          to="deleted"
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          label="main.global.button.deleted"
          tooltip="main.global.button.add"
          isMobileView={table.isMobileView}
        />
      </HasPermission>
    </>
  );

  const renderFilterOption = (item: { name: string; translatedName?: string }) => (
    <div className="flex flex-col py-0.5">
      <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.name}</span>

      <span className="text-xs text-gray-500 dark:text-gray-400">{item.translatedName}</span>
    </div>
  );

  return (
    <PageSection title={t('user.pageTitle.users')} actions={actionsButtons}>
      {/* Show/hide columns + Remember state */}
      <MatTableToolbar
        table={table}
        allColumns={allColumns}
        columnTranslations={columnTranslations}
      />

      {/* Additional filters */}
      <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="roleFilter"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t('user.form.role')}
            </label>

            <MultiSelect
              id="roleFilter"
              items={roles}
              loading={isLoadingRoles}
              bindLabel={(role) => role.name}
              bindValue={(role) => role.name}
              value={(table.criteria['filter[role]'] as string[] | undefined) ?? []}
              onChange={(value) => {
                table.setCriteria({ 'filter[role]': value });
                table.onFilterSelect();
              }}
              renderOption={renderFilterOption}
              notFoundText={t('main.ngSelect.nothingFound')}
              loadingText={t('main.ngSelect.loading')}
            />
          </div>

          {/* Permissions */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="permissionFilter"
              className="text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              {t('user.form.permission')}
            </label>

            <MultiSelect
              id="permissionFilter"
              items={permissions}
              loading={isLoadingPermissions}
              bindLabel={(permission) => permission.name}
              bindValue={(permission) => permission.name}
              value={(table.criteria['filter[permission]'] as string[] | undefined) ?? []}
              onChange={(value) => {
                table.setCriteria({ 'filter[permission]': value });
                table.onFilterSelect();
              }}
              renderOption={renderFilterOption}
              notFoundText={t('main.ngSelect.nothingFound')}
              loadingText={t('main.ngSelect.loading')}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <MatTable table={table} columns={columns} rowKey={(row) => String(row.id)} />
    </PageSection>
  );
}
