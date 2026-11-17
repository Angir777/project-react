import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBaseDisplay } from '@/shared/components/base-components/use-base-display';
import { CancelButton } from '@/shared/components/ui/cancel-button/cancel-button';
import {
  DisplayList,
  DisplayRow,
  PillBadge,
} from '@/shared/components/ui/display-list/display-list';
import { Loader } from '@/shared/components/ui/loader/loader';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import type { Role } from '@/shared/interfaces';
import { roleService, toastService } from '@/shared/services';

export function DisplayRole() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isLoading, setIsLoading } = useBaseDisplay();

  // Model
  const [role, setRole] = useState<Role | null>(null);

  /**
   * Fetch the data of the currently displayed model
   */
  useEffect(() => {
    if (id == null) {
      return;
    }

    setIsLoading(true);

    roleService
      .getById(id)
      .then((res) => {
        if (res.data) {
          setRole(res.data);
        }
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [id, setIsLoading]);

  // Actions
  const actionsButtons = (
    <>
      {/* Back */}
      <CancelButton />
    </>
  );

  return (
    <PageSection
      title={t('role.pageTitle.display')}
      actions={actionsButtons}
      footerClassName="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end"
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader isLoading={true} />
        </div>
      ) : (
        role !== null && (
          <DisplayList>
            {/* ID */}
            <DisplayRow label={t('main.global.id')}>{role.id}</DisplayRow>

            {/* Name */}
            <DisplayRow label={t('role.form.name')}>{role.name}</DisplayRow>

            {/* Guard */}
            <DisplayRow label={t('role.form.guardName')}>{role.guardName}</DisplayRow>

            {/* Permissions */}
            <DisplayRow label={t('role.form.permissionsCount')} plain>
              <div className="flex flex-wrap gap-2">
                {role.permissions?.map((permission) => (
                  <PillBadge key={permission.id}>
                    {permission.translatedName} [{permission.name}]
                  </PillBadge>
                ))}
              </div>
            </DisplayRow>
          </DisplayList>
        )
      )}
    </PageSection>
  );
}
