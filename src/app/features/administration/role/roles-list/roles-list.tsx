import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClockRotateLeft,
  faEye,
  faPenToSquare,
  faPlus,
  faSpinner,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
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
import { PageActionButton } from '@/shared/components/ui/page-action-button/page-action-button';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import type { Role } from '@/shared/interfaces';
import { roleService, translatedSwalService } from '@/shared/services';
import { RoleHistoryModal } from '../../components/role-history-modal/role-history-modal';

// Table columns
const displayedColumns = ['actions', 'id', 'name', 'guardName', 'permissionsCount'];

// Column translations for 'Show/hide columns'
const columnTranslations: Record<string, string> = {
  actions: 'main.global.actions',
  id: 'main.global.id',
  name: 'role.form.name',
  guardName: 'role.form.guardName',
  permissionsCount: 'role.form.permissionsCount',
};

// All table columns (Show/hide columns)
const allColumns = displayedColumns;

export function RolesList() {
  const { t } = useTranslation();
  const dialogService = useAppDialog();

  const table = useMatTable<Role>({
    storageKey: 'role',
    fetchMethod: roleService.query,
    displayedColumns,
  });

  // Rows being deleted (Angular: row.isDeleting)
  const [deletingIds, setDeletingIds] = useState<Role['id'][]>([]);

  // Change history modal
  const openHistoryModal = async (role: Role) => {
    const ref = dialogService.open<boolean>(RoleHistoryModal, {
      title: 'main.global.history.title',
      width: '1000px',
      maximizable: true,
      data: { id: role.id },
    });

    if (await ref.closed) {
      table.refreshTable();
    }
  };

  // Deletion
  const deleteRole = async (role: Role) => {
    const result = await translatedSwalService.showAsync(
      'role.message.question.areYouSureYouWantDelete',
      {
        name: role.name,
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
      setDeletingIds((ids) => [...ids, role.id]);

      try {
        await roleService.delete(role.id);

        void translatedSwalService.show('success', 'role.message.success.deletedSuccessfully', {
          name: role.name,
        });
        table.refreshTable();
      } catch {
        void translatedSwalService.show('error', 'role.message.error.cantDeleted', {
          name: role.name,
        });
      } finally {
        setDeletingIds((ids) => ids.filter((id) => id !== role.id));
      }
    }
  };

  const columns: Record<string, MatColumnDef<Role>> = {
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
          <HasPermission only={['ROLES_UPDATE']}>
            <TableActionButton tooltip="main.global.tooltip.edit" to={`edit/${row.id}`}>
              <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
            </TableActionButton>
          </HasPermission>

          {/* Delete */}
          <HasPermission only={['ROLES_DELETE']}>
            <TableActionButton tooltip="main.global.tooltip.delete" onClick={() => deleteRole(row)}>
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
      style: { width: '5%' },
      header: <MatFilterHeader table={table} id="id" label="main.global.id" />,
      cell: (row) => row.id,
    },

    // Name
    name: {
      header: <MatFilterHeader table={table} id="name" label="role.form.name" />,
      cell: (row) => row.name,
    },

    // Guard
    guardName: {
      header: <MatFilterHeader table={table} id="guardName" label="role.form.guardName" />,
      cell: (row) => row.guardName,
    },

    // Assigned permissions
    permissionsCount: {
      header: (
        <MatFilterHeader
          table={table}
          id="permissionsCount"
          label="role.form.permissionsCount"
          sortable={false}
          filterDisabled
        />
      ),
      cell: (row) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          {row.permissions?.length ?? 0}
        </span>
      ),
    },
  };

  // Actions
  const actionsButtons = (
    <>
      {/* Add */}
      <HasPermission only={['ROLES_CREATE']}>
        <PageActionButton
          to="add"
          icon={<FontAwesomeIcon icon={faPlus} />}
          label="main.global.button.add"
          isMobileView={table.isMobileView}
        />
      </HasPermission>
    </>
  );

  return (
    <PageSection
      title={t('role.pageTitle.roles')}
      actions={actionsButtons}
      footerClassName="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end"
    >
      {/* Show/hide columns + Remember state */}
      <MatTableToolbar
        table={table}
        allColumns={allColumns}
        columnTranslations={columnTranslations}
      />

      {/* Table */}
      <MatTable table={table} columns={columns} rowKey={(row) => String(row.id)} />
    </PageSection>
  );
}
