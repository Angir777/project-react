import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateLeft, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { HasPermission } from '@/shared/components/has-permission/has-permission';
import {
  MatFilterHeader,
  MatTable,
  MatTableToolbar,
  type MatColumnDef,
} from '@/shared/components/mat-table/mat-table';
import { TableActionButton } from '@/shared/components/mat-table/table-action-button';
import { useMatTable } from '@/shared/components/mat-table/use-mat-table';
import { CancelButton } from '@/shared/components/ui/cancel-button/cancel-button';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import type { User } from '@/shared/interfaces';
import { translatedSwalService, userService } from '@/shared/services';
import { formatDate } from '@/shared/utils';

// Table columns
const displayedColumns = ['actions', 'id', 'fullName', 'email', 'deletedAt'];

// Column translations for 'Show/hide columns'
const columnTranslations: Record<string, string> = {
  actions: 'main.global.actions',
  id: 'main.global.id',
  fullName: 'user.form.fullName',
  email: 'user.form.email',
  deletedAt: 'user.form.deletedAt',
};

// All table columns (Show/hide columns)
const allColumns = displayedColumns;

export function DeletedUsersList() {
  const { t } = useTranslation();

  // The endpoint for deleted users (Angular: overridden `fetchMethod`)
  const table = useMatTable<User>({
    storageKey: 'user',
    fetchMethod: userService.queryDeleted,
    displayedColumns,
  });

  // Rows being restored (Angular: row.isRestoring)
  const [restoringIds, setRestoringIds] = useState<User['id'][]>([]);

  // Restoration
  const restore = async (user: User) => {
    const result = await translatedSwalService.showAsync(
      'user.message.question.areYouSureYouWantRestore',
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
      setRestoringIds((ids) => [...ids, user.id]);

      try {
        await userService.restore(user.id);

        void translatedSwalService.show('success', 'user.message.success.restoredSuccessfully', {
          name: user.fullName,
        });
        table.refreshTable();
      } catch {
        void translatedSwalService.show('error', 'user.message.error.cantRestored', {
          name: user.fullName,
        });
      } finally {
        setRestoringIds((ids) => ids.filter((id) => id !== user.id));
      }
    }
  };

  const columns: Record<string, MatColumnDef<User>> = {
    // Actions
    actions: {
      cell: (row) => (
        <div className="flex items-center gap-1">
          {/* Restore */}
          <HasPermission only={['USERS_DELETE']}>
            <TableActionButton tooltip="main.global.tooltip.restore" onClick={() => restore(row)}>
              {restoringIds.includes(row.id) ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-sm" />
              ) : (
                <FontAwesomeIcon icon={faArrowRotateLeft} className="text-sm" />
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

    // Deletion date
    deletedAt: {
      header: <MatFilterHeader table={table} id="deletedAt" label="user.form.deletedAt" />,
      cell: (row) => formatDate(row.deletedAt),
    },
  };

  // Actions
  const actionsButtons = (
    <>
      {/* Back */}
      <CancelButton />
    </>
  );

  return (
    <PageSection
      title={t('user.pageTitle.deleted')}
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
