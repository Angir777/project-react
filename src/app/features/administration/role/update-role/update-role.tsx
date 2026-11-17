import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isAxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/shadcn/components/ui/input';
import { Switch } from '@/shadcn/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/ui/tooltip';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { CancelButton } from '@/shared/components/ui/cancel-button/cancel-button';
import { Loader } from '@/shared/components/ui/loader/loader';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import { SaveButton } from '@/shared/components/ui/save-button/save-button';
import { Validators } from '@/shared/helpers/validators';
import type { Permission, Role } from '@/shared/interfaces';
import { roleService, toastService, translatedSwalService } from '@/shared/services';

interface PermissionGroupView {
  name: string;
  translatedName: string;
  permissions: Permission[];
}

const schema = yup.object({
  name: yup.string().default('').required(Validators.required),
});

type UpdateRoleForm = yup.InferType<typeof schema>;

export function UpdateRole() {
  const { t } = useTranslation();
  const { id } = useParams();

  // Role
  const [role, setRole] = useState<Role | null>(null);

  // Permissions
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  // Flag for showing only selected permissions
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // Info tooltip (toggled on click)
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Form
  const form = useForm<UpdateRoleForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '' },
  });

  const {
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    setServerErrors,
    clearServerErrors,
    isFormControlInvalid,
    controlErrors,
    previousState,
  } = useBaseUpdate(form);

  // Fetch permissions (and mark the ones assigned to the role)
  const getPermissions = useCallback((currentRole: Role | null) => {
    roleService
      .getPermissions()
      .then((allPermissions) => {
        // Prepare permissions for display
        if (!currentRole?.permissions?.length) {
          setPermissions(allPermissions);
          setShowOnlySelected(false);
          return;
        }

        const selectedPermissionIds = new Set(
          currentRole.permissions.map((permission) => permission.id),
        );

        setPermissions(
          allPermissions.map((permission) => ({
            ...permission,
            isSelected: selectedPermissionIds.has(permission.id),
          })),
        );

        setShowOnlySelected(true);
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoadingPermissions(false));
  }, []);

  // Create or Update
  useEffect(() => {
    if (id == null) {
      // Load available permissions
      getPermissions(null);
      return;
    }

    setIsLoading(true);

    roleService
      .getById(+id)
      .then((res) => {
        if (res.data !== null) {
          setRole(res.data);

          // Update the form
          form.reset({ name: res.data.name });

          // Load available permissions
          getPermissions(res.data);
        }
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [id, form, getPermissions, setIsLoading]);

  // Permissions grouped for display
  const groupedPermissions = useMemo<PermissionGroupView[]>(() => {
    const groups = new Map<string, PermissionGroupView>();

    let visiblePermissions = permissions;

    if (showOnlySelected) {
      visiblePermissions = visiblePermissions.filter((p) => p.isSelected);
    }

    visiblePermissions.forEach((permission) => {
      const groupName = permission.groupName || 'OTHER';

      if (!groups.has(groupName)) {
        groups.set(groupName, {
          name: groupName,
          translatedName: t(`role.permissionGroups.${groupName}`),
          permissions: [],
        });
      }

      groups.get(groupName)!.permissions.push(permission);
    });

    return [...groups.values()];
  }, [permissions, showOnlySelected, t]);

  // Number of selected / all permissions
  const permissionsStats = {
    selected: permissions.filter((permission) => permission.isSelected).length,
    total: permissions.length,
  };

  const onPermissionChange = (permissionId: number, isSelected: boolean) =>
    setPermissions((list) =>
      list.map((permission) =>
        permission.id === permissionId ? { ...permission, isSelected } : permission,
      ),
    );

  // Prepare selected permissions for saving
  const preparePermissionsToSave = (): number[] =>
    permissions
      .filter((permission) => permission.isSelected && permission.id !== undefined)
      .map((permission) => Number(permission.id));

  // Build the object to save from the form
  const createDataToSaveFromForm = (): Role =>
    ({
      id: role?.id,
      name: form.getValues('name'),
      permissions: permissions.filter((permission) => permission.isSelected),
    }) as Role;

  // Call save
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    const valid = await form.trigger();
    if (!valid) {
      toastService.show('error', 'main.global.validation.formNotCorrect');
      return;
    }

    // Prepare selected permissions for saving
    const selectedPermissions = preparePermissionsToSave();
    if (!selectedPermissions || selectedPermissions.length === 0) {
      // At least one permission must be selected
      toastService.show('warn', 'role.message.error.selectMinOnePermission');
      return;
    }

    // Object to save
    const dataToSave = createDataToSaveFromForm();

    setIsSaving(true);

    try {
      if (role === null) {
        await roleService.create(dataToSave);
      } else {
        await roleService.update(dataToSave);
      }

      // Called when the API returns OK
      void translatedSwalService.show(
        'success',
        'role.message.success.createdUpdatedSuccessfully',
        {},
      );
      previousState();
    } catch (errorRes) {
      // Called when the API returns an error
      if (isAxiosError(errorRes) && errorRes.response?.data?.errors != null) {
        setServerErrors(errorRes.response.data.errors);
      }

      void translatedSwalService.show('error', 'role.message.error.cantCreateUpdate', {});
    } finally {
      setIsSaving(false);
    }
  };

  // Actions
  const actionsButtons = (
    <>
      {/* Save */}
      {!isLoading && !isLoadingPermissions && <SaveButton type="submit" loading={isSaving} />}
      {/* Back */}
      <CancelButton />
    </>
  );

  return (
    <form name="form" role="form" noValidate onSubmit={onSubmit}>
      <PageSection
        title={role?.id ? t('role.pageTitle.edit') : t('role.pageTitle.add')}
        actions={actionsButtons}
        footerClassName="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 dark:border-zinc-800 sm:flex-row sm:justify-end"
      >
        {isLoading || isLoadingPermissions ? (
          <div className="flex justify-center py-12">
            <Loader isLoading={true} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t('role.form.name')} *
                </label>

                <Input
                  {...form.register('name')}
                  id="name"
                  type="text"
                  autoComplete="off"
                  aria-invalid={isFormControlInvalid('name', 'name') ? 'true' : undefined}
                  onKeyDown={() => clearServerErrors('name')}
                />

                {controlErrors('name')}
              </div>
            </div>

            <div className="my-8 border-t border-gray-200 dark:border-zinc-800"></div>

            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {t('role.form.permissions')}
                  </h3>

                  <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                      <span
                        tabIndex={0}
                        role="button"
                        className="cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 mb-2"
                        onClick={() => setTooltipOpen((open) => !open)}
                      >
                        <FontAwesomeIcon icon={faCircleInfo} />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-sm text-sm">
                      {t('role.message.info.aboutSelectPermissions')}
                    </TooltipContent>
                  </Tooltip>
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t('role.form.selected', {
                    selected: permissionsStats.selected,
                    total: permissionsStats.total,
                  })}
                </p>
              </div>

              {role?.id && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('role.form.showOnlySelected')}
                  </span>

                  <Switch checked={showOnlySelected} onCheckedChange={setShowOnlySelected} />
                </div>
              )}
            </div>

            {/* Permission groups */}
            <div className="space-y-6">
              {groupedPermissions.map((group) => (
                <div
                  key={group.name}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {group.translatedName}
                    </h4>
                  </div>

                  {/* Permissions */}
                  <div className="grid gap-3 p-5 lg:grid-cols-2">
                    {group.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3 dark:border-zinc-700"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {permission.translatedName}
                          </div>

                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {permission.name}
                          </div>
                        </div>

                        <Switch
                          checked={!!permission.isSelected}
                          onCheckedChange={(checked) => onPermissionChange(permission.id, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </PageSection>
    </form>
  );
}
