/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type ComponentType } from 'react';
import type { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { credentialsService } from '@/core/services/credentials.service';
import { useDialogData, useDialogRef } from '@/shared/components/ui/dialog/dialog.context';
import { CancelButton } from '@/shared/components/ui/cancel-button/cancel-button';
import { Loader } from '@/shared/components/ui/loader/loader';
import type { HistoryModel } from '@/shared/interfaces';
import { toastService } from '@/shared/services/translated-toast/translated-toast.service';
import { formatDate } from '@/shared/utils';

interface HistoryModalBaseProps {
  /** `dataService.getHistory` of the given resource. */
  getHistory: (id: number | string) => Promise<AxiosResponse<any>>;
  /** Component rendering the parsed `diff` (user / role history object). */
  historyObject: ComponentType<{ history: Record<string, any> }>;
}

/**
 * Change history table shared by `UserHistoryModal` and `RoleHistoryModal`
 * (the Angular components have identical templates and logic).
 */
export function HistoryModalBase({
  getHistory,
  historyObject: HistoryObject,
}: HistoryModalBaseProps) {
  const { t } = useTranslation();
  const ref = useDialogRef<boolean>();
  const { id } = useDialogData<{ id: number }>();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<HistoryModel[]>([]);

  // Check whether the user is a super administrator
  const [isAdministrator] = useState(() => credentialsService.checkUserRole('superadmin'));

  useEffect(() => {
    getHistory(id)
      .then((res) => {
        if (res.data != null) {
          setHistory(
            res.data.map((value: { diff: string }) => ({
              ...value,
              diff: JSON.parse(value.diff),
            })),
          );
        }
      })
      .catch(() => {
        // Failed to fetch the change history for the selected item!
        toastService.show('error', 'main.global.history.message.error.cantLoad');
        ref.close();
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getHistory, id]);

  const thClasses =
    'w-px whitespace-nowrap px-3 py-3 text-left font-medium text-gray-700 dark:text-gray-200';
  const tdClasses = 'whitespace-nowrap px-3 py-3 align-top text-gray-700 dark:text-gray-300';

  return (
    <div className="flex max-h-[85vh] flex-col overflow-hidden">
      <div className="min-h-0 pt-2">
        {isLoading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader isLoading={isLoading} />
          </div>
        ) : history.length > 0 ? (
          <div className="max-h-[calc(85vh-145px)] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/70">
                <tr>
                  {/* Data */}
                  <th className={thClasses}>{t('main.global.history.headers.createdAt')}</th>

                  {/* Changed by */}
                  <th className={thClasses}>{t('main.global.history.headers.changedBy')}</th>

                  {/* Action type */}
                  <th className={thClasses}>{t('main.global.history.headers.actionType')}</th>

                  {/* IP */}
                  {isAdministrator && (
                    <th className={thClasses}>{t('main.global.history.headers.ip')}</th>
                  )}

                  {/* Old vs new data */}
                  <th className="min-w-75 px-3 py-3 text-center font-medium text-gray-700 dark:text-gray-200">
                    {t('main.global.history.headers.oldData')}{' '}
                    <span className="text-gray-400">vs.</span>{' '}
                    {t('main.global.history.headers.newData')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {history.map((his) => (
                  <tr
                    key={his.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                  >
                    {/* Data */}
                    <td className={tdClasses}>{formatDate(his.createdAt)}</td>

                    {/* Changed by */}
                    <td className="px-3 py-3 align-top text-gray-700 dark:text-gray-300">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 dark:text-gray-100">
                          {his.changedByUserName}
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {his.changedByUserEmail}
                        </span>
                      </div>
                    </td>

                    {/* Action type */}
                    <td className={tdClasses}>
                      {t('main.global.history.actionTypes.' + his.actionType)}
                    </td>

                    {/* IP */}
                    {isAdministrator && <td className={tdClasses}>{his.ip || '-'}</td>}

                    {/* Old vs new data */}
                    <td className="px-3 py-3 align-top">
                      <HistoryObject history={his.diff} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            {t('main.global.history.empty')}
          </div>
        )}
      </div>

      <div className="flex shrink-0 justify-end pt-3">
        <CancelButton
          label="main.global.button.close"
          onClick={() => ref.close()}
          showIcon={false}
        />
      </div>
    </div>
  );
}
