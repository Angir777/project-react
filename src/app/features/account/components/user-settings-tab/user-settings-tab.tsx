import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Switch } from '@/shadcn/components/ui/switch';
import { credentialsService } from '@/core/services/credentials.service';
import { Loader } from '@/shared/components/ui/loader/loader';
import { SaveButton } from '@/shared/components/ui/save-button/save-button';
import type { UserSettings } from '@/shared/interfaces';
import { accountService, toastService, translatedSwalService } from '@/shared/services';

export function UserSettingsTab() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Settings returned by the API
  const [settings, setSettings] = useState<UserSettings>({});

  // Form values ({ [settingName]: boolean })
  const [formValue, setFormValue] = useState<Record<string, boolean>>({});

  // Update the form
  const updateForm = useCallback((data: UserSettings) => {
    setSettings(data);

    setFormValue((current) => {
      const next = { ...current };

      Object.values(data).forEach((setting) => {
        next[setting.name] = setting.value;
      });

      return next;
    });
  }, []);

  /**
   * Fetch user settings
   */
  const getUserSettings = useCallback(() => {
    accountService
      .getUserSettings()
      .then((response) => {
        if (response.data) {
          const data = response.data;

          // Update the form
          updateForm(data);

          // Update settings in credentials
          const currentCredentials = credentialsService.credentials;

          if (currentCredentials) {
            const credentials = {
              ...currentCredentials,
              settings: Object.fromEntries(
                Object.values(data).map((setting) => [setting.name, setting.value]),
              ),
            };

            credentialsService.setCredentials(credentials);
          }
        }
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [updateForm]);

  useEffect(() => {
    // Fetch the logged-in user's settings
    getUserSettings();
  }, [getUserSettings]);

  // List of setting names
  const settingNames = Object.keys(settings);

  // Call save
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await accountService.updateUserSettings(formValue);

      if (response.data) {
        updateForm(response.data);
      }

      void translatedSwalService.show('success', 'account.message.success.updatedSuccessfully', {});
    } catch {
      void translatedSwalService.show('error', 'account.message.error.cantUpdate', {});
    } finally {
      setIsSaving(false);

      // Refresh the displayed permissions
      setIsLoading(true);
      getUserSettings();
    }
  };

  return (
    <form name="form" role="form" noValidate onSubmit={onSubmit}>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader isLoading={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <section className="rounded-lg border border-gray-200 p-5 dark:border-zinc-700">
            <h6 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
              {t('account.settingsTab.title')}
            </h6>

            <div className="grid grid-cols-1 gap-4">
              {settingNames.map((settingName) => {
                const setting = settings[settingName];

                return (
                  <div
                    key={settingName}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-zinc-700"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {setting.translatedName}
                      </div>

                      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {setting.translatedDescription}
                      </div>
                    </div>

                    <Switch
                      checked={formValue[setting.name] ?? false}
                      onCheckedChange={(checked) =>
                        setFormValue((current) => ({ ...current, [setting.name]: checked }))
                      }
                    />
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 flex justify-end">
        {/* Save */}
        <SaveButton type="submit" loading={isSaving} />
      </div>
    </form>
  );
}
