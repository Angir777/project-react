import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useBaseDisplay } from '@/shared/components/base-components/use-base-display';
import { CancelButton } from '@/shared/components/ui/cancel-button/cancel-button';
import { Loader } from '@/shared/components/ui/loader/loader';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import {
  DisplayList,
  DisplayRow,
  PillBadge,
} from '@/shared/components/ui/display-list/display-list';
import type { Permission, User } from '@/shared/interfaces';
import { toastService, userService } from '@/shared/services';
import { formatDate } from '@/shared/utils';

export function DisplayUser() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { isLoading, setIsLoading } = useBaseDisplay();

  // Model
  const [user, setUser] = useState<User | null>(null);

  /**
   * Fetch the data of the currently displayed model
   */
  useEffect(() => {
    if (id == null) {
      return;
    }

    setIsLoading(true);

    userService
      .getById(id)
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [id, setIsLoading]);

  /**
   * Load all permissions from the user's roles
   */
  const getPermissions = (): Permission[] => {
    const permissions = user?.roles?.flatMap((role) => role.permissions ?? []) ?? [];

    return permissions.filter(
      (permission, index, array) => array.findIndex((item) => item.id === permission.id) === index,
    );
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
      title={t('user.pageTitle.display')}
      actions={actionsButtons}
      footerClassName="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-end"
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader isLoading={true} />
        </div>
      ) : (
        user !== null && (
          <DisplayList>
            {/* ID */}
            <DisplayRow label={t('main.global.id')}>{user.id}</DisplayRow>

            {/* Full name */}
            <DisplayRow label={t('user.form.fullName')}>{user.fullName}</DisplayRow>

            {/* Email */}
            <DisplayRow label={t('user.form.email')}>{user.email}</DisplayRow>

            {/* Role */}
            <DisplayRow label={t('user.form.role')} plain>
              <div className="flex flex-wrap gap-2">
                {user.roles?.map((role) => (
                  <PillBadge key={role.id ?? role.name}>
                    {role.translatedName} [{role.name}]
                  </PillBadge>
                ))}
              </div>
            </DisplayRow>

            {/* Permissions */}
            <DisplayRow label={t('user.form.permission')} plain>
              <div className="flex flex-wrap gap-2">
                {getPermissions().map((permission) => (
                  <PillBadge key={permission.id}>
                    {permission.translatedName} [{permission.name}]
                  </PillBadge>
                ))}
              </div>
            </DisplayRow>

            {/* Account confirmed */}
            <DisplayRow label={t('user.form.confirmed')} plain>
              {user.confirmed ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {t('user.form.confirmed')}
                  </span>

                  {user.emailVerifiedAt && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.emailVerifiedAt)}
                    </span>
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  {t('user.form.notConfirmed')}
                </span>
              )}
            </DisplayRow>
          </DisplayList>
        )
      )}
    </PageSection>
  );
}
