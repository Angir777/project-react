import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/shadcn/components/ui/input';
import { Switch } from '@/shadcn/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/components/ui/select';
import { useDialogData, useDialogRef } from '@/shared/components/ui/dialog/dialog.context';
import { Loader } from '@/shared/components/ui/loader/loader';
import { SaveButton } from '@/shared/components/ui/save-button/save-button';
import type { Role, User } from '@/shared/interfaces';
import { roleService, toastService, translatedSwalService, userService } from '@/shared/services';

type AssignedRoleFilter = 'all' | 'assigned' | 'notAssigned';
type RoleSortColumn = 'id' | 'assigned' | 'name' | 'permissions';
type SortDirection = 'asc' | 'desc';

const normalizeText = (value: string | null | undefined): string =>
  (value ?? '').trim().toLowerCase();

const compareStrings = (a: string | null | undefined, b: string | null | undefined): number =>
  (a ?? '').localeCompare(b ?? '', 'pl');

const getParsedPermissions = (role: Role): string =>
  (role.permissions ?? []).map((permission) => permission.translatedName).join(', ');

export function AttachRoleModal() {
  const { t } = useTranslation();
  const ref = useDialogRef<boolean>();
  const { user } = useDialogData<{ user: User }>();

  // State
  const [roles, setRoles] = useState<Role[]>([]);

  const [assignedRoleFilter, setAssignedRoleFilter] = useState<AssignedRoleFilter>('assigned');
  const [roleNameFilter, setRoleNameFilter] = useState('');

  const [sortColumn, setSortColumn] = useState<RoleSortColumn>('id');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Fetch roles
   */
  useEffect(() => {
    const currentRoleNames = (user.roles ?? []).map((role) => role.name);

    roleService
      .getAll()
      .then((res) => {
        const allRoles: Role[] = res.data ?? [];

        setRoles(
          allRoles.map((role) => ({
            ...role,
            isSelected: currentRoleNames.includes(role.name),
          })),
        );
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [user]);

  /**
   * Roles and permissions
   */

  const compareRoles = (a: Role, b: Role): number => {
    const direction = sortDirection === 'asc' ? 1 : -1;

    switch (sortColumn) {
      case 'id':
        return (Number(a.id) - Number(b.id)) * direction;

      case 'assigned':
        return (Number(a.isSelected) - Number(b.isSelected)) * direction;

      case 'name':
        return compareStrings(a.name, b.name) * direction;

      case 'permissions':
        return compareStrings(getParsedPermissions(a), getParsedPermissions(b)) * direction;

      default:
        return 0;
    }
  };

  const getVisibleRoles = (): Role[] => {
    const normalizedRoleNameFilter = normalizeText(roleNameFilter);

    return roles
      .filter((role) => {
        if (assignedRoleFilter === 'assigned') {
          return role.isSelected;
        }

        if (assignedRoleFilter === 'notAssigned') {
          return !role.isSelected;
        }

        return true;
      })
      .filter((role) => {
        if (!normalizedRoleNameFilter) {
          return true;
        }

        const searchableName = normalizeText(`${role.name ?? ''}`);

        return searchableName.includes(normalizedRoleNameFilter);
      })
      .sort(compareRoles);
  };

  const setSort = (column: RoleSortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

      return;
    }

    setSortColumn(column);
    setSortDirection('asc');
  };

  const getSortIcon = (column: RoleSortColumn): string => {
    if (sortColumn !== column) {
      return '';
    }

    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const toggleRole = (roleId: Role['id'], isSelected: boolean) =>
    setRoles((list) => list.map((role) => (role.id === roleId ? { ...role, isSelected } : role)));

  /**
   * Save
   */
  const onSubmit = async () => {
    const selectedRolesIds: number[] = roles
      .filter((role) => role.isSelected)
      .map((role) => Number(role.id))
      .filter((id) => Number.isInteger(id) && id > 0);

    if (selectedRolesIds.length < 1) {
      void translatedSwalService.show('error', 'user.message.error.selectMinOneRole', {});

      return;
    }

    if (!user?.id) {
      void translatedSwalService.show('error', 'user.message.error.cantCreateUpdate', {});

      return;
    }

    setIsSaving(true);

    try {
      await userService.attachRoles(user.id, selectedRolesIds);

      void translatedSwalService.show(
        'success',
        'user.message.success.createdUpdatedSuccessfully',
        {},
      );

      ref.close(true);
    } catch {
      void translatedSwalService.show('error', 'user.message.error.cantCreateUpdate', {});
    } finally {
      setIsSaving(false);
    }
  };

  const sortButtonClasses =
    'flex cursor-pointer items-center gap-1 p-0 text-left font-medium text-gray-700 transition hover:text-gray-950 dark:text-gray-200 dark:hover:text-white';

  const visibleRoles = getVisibleRoles();

  return (
    <div className="flex max-h-[85vh] flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.fullNameWithEmail || user.fullName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SaveButton type="button" loading={isSaving} onClick={onSubmit} />
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 pt-2">
        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader isLoading={isLoading} />
          </div>
        ) : (
          <div className="max-h-[calc(85vh-100px)] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {/* Assigned */}
                  <th className="w-[130px] px-3 py-3 text-left align-top">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className={sortButtonClasses}
                        onClick={() => setSort('assigned')}
                      >
                        {t('user.roleTable.assigned')}

                        {getSortIcon('assigned') && (
                          <span className="text-xs text-gray-400">{getSortIcon('assigned')}</span>
                        )}
                      </button>

                      <Select
                        value={assignedRoleFilter}
                        onValueChange={(value) =>
                          setAssignedRoleFilter(value as AssignedRoleFilter)
                        }
                      >
                        <SelectTrigger id="assignedRoleFilter" className="w-full font-normal">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent position="popper">
                          <SelectItem value="all">{t('main.global.all')}</SelectItem>
                          <SelectItem value="assigned">{t('main.global.yes')}</SelectItem>
                          <SelectItem value="notAssigned">{t('main.global.no')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </th>

                  {/* State */}
                  <th className="w-[70px] px-3 py-3 text-left align-top">
                    <span className="font-medium text-gray-700 dark:text-gray-200">
                      {t('user.roleTable.state')}
                    </span>
                  </th>

                  {/* Name */}
                  <th className="w-[140px] px-3 py-3 text-left align-top">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className={sortButtonClasses}
                        onClick={() => setSort('name')}
                      >
                        {t('user.roleTable.name')}

                        {getSortIcon('name') && (
                          <span className="text-xs text-gray-400">{getSortIcon('name')}</span>
                        )}
                      </button>

                      <Input
                        id="roleNameFilter"
                        type="text"
                        className="font-normal"
                        autoComplete="off"
                        value={roleNameFilter}
                        onChange={(event) => setRoleNameFilter(event.target.value)}
                        placeholder={t('user.roleTable.searchRole')}
                      />
                    </div>
                  </th>

                  {/* Permissions */}
                  <th className="px-3 py-3 text-left align-top">
                    <button
                      type="button"
                      className={sortButtonClasses}
                      onClick={() => setSort('permissions')}
                    >
                      {t('user.roleTable.permissions')}

                      {getSortIcon('permissions') && (
                        <span className="text-xs text-gray-400">{getSortIcon('permissions')}</span>
                      )}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {visibleRoles.length > 0 ? (
                  visibleRoles.map((role) => (
                    <tr
                      key={role.id}
                      className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    >
                      {/* Assigned */}
                      <td className="px-3 py-3 align-middle">
                        {role.isSelected ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {t('main.global.yes')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            {t('main.global.no')}
                          </span>
                        )}
                      </td>

                      {/* Switch */}
                      <td className="px-3 py-3 align-middle">
                        <Switch
                          checked={!!role.isSelected}
                          onCheckedChange={(checked) => toggleRole(role.id, checked)}
                        />
                      </td>

                      {/* Name */}
                      <td className="px-3 py-3 align-middle">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {role.name}
                        </span>
                      </td>

                      {/* Permissions */}
                      <td className="px-3 py-3 align-middle text-gray-600 dark:text-gray-400">
                        {role.permissions?.length ? (
                          <span>{getParsedPermissions(role)}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500"> — </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      {t('user.message.info.noRolesAssigned')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
