import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isAxiosError } from 'axios';
import { Input } from '@/shadcn/components/ui/input';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { Loader } from '@/shared/components/ui/loader/loader';
import { SaveButton } from '@/shared/components/ui/save-button/save-button';
import { Validators } from '@/shared/helpers/validators';
import type { ChangePassword } from '@/shared/interfaces';
import { accountService, toastService, translatedSwalService } from '@/shared/services';

const schema = yup.object({
  oldPassword: yup.string().default('').required(Validators.required),
  newPassword: yup
    .string()
    .default('')
    .required(Validators.required)
    .min(8, Validators.minLength(8)),
  passwordConfirmation: yup.string().default('').required(Validators.required),
});

type UserPasswordForm = yup.InferType<typeof schema>;

export function UserPasswordTab() {
  const { t } = useTranslation();

  // Form
  const form = useForm<UserPasswordForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { oldPassword: '', newPassword: '', passwordConfirmation: '' },
  });

  const {
    isLoading,
    isSaving,
    setIsSaving,
    setServerErrors,
    clearServerErrors,
    isFormControlInvalid,
    controlErrors,
  } = useBaseUpdate(form);

  // Build the object to save from the form
  const createDataToSaveFromForm = (): ChangePassword => {
    const formValue = form.getValues();

    return {
      oldPassword: formValue.oldPassword,
      newPassword: formValue.newPassword,
      passwordConfirmation: formValue.passwordConfirmation,
    };
  };

  // Called when the API returns OK
  const onSaveSuccess = () => {
    void translatedSwalService.show('success', 'account.message.success.updatedSuccessfully', {});

    // Reset the form
    form.reset();
  };

  // Called when the API returns an error
  const onSaveError = (errorRes: unknown) => {
    const data = isAxiosError(errorRes) ? errorRes.response?.data : undefined;

    if (data != null && data.errors != null) {
      setServerErrors(data.errors);
    }

    if (data?.message === 'OLD_PASSWORD_INCORRECT') {
      void translatedSwalService.show('error', 'account.message.error.oldPasswordIncorrect', {});
    } else {
      void translatedSwalService.show('error', 'account.message.error.cantUpdate', {});
    }
  };

  // Call save
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    const valid = await form.trigger();
    if (!valid || isSaving) {
      toastService.show('error', 'main.global.validation.formNotCorrect');
      return;
    }

    // Object to save
    const dataToSave = createDataToSaveFromForm();

    setIsSaving(true);
    try {
      await accountService.changePassword(dataToSave);
      onSaveSuccess();
    } catch (err) {
      onSaveError(err);
    } finally {
      setIsSaving(false);
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
              {t('account.passwordTab.title')}
            </h6>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Current password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="oldPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t('account.passwordTab.oldPassword')} *
                </label>

                <Input
                  {...form.register('oldPassword')}
                  id="oldPassword"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={
                    isFormControlInvalid('oldPassword', 'oldPassword') ? 'true' : undefined
                  }
                  onKeyDown={() => clearServerErrors('oldPassword')}
                />

                {controlErrors('oldPassword')}
              </div>

              {/* New password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="newPassword"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t('account.passwordTab.newPassword')} *
                </label>

                <Input
                  {...form.register('newPassword')}
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={
                    isFormControlInvalid('newPassword', 'newPassword') ? 'true' : undefined
                  }
                  onKeyDown={() => clearServerErrors('newPassword')}
                />

                {controlErrors('newPassword')}
              </div>

              {/* Repeat password */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="passwordConfirmation"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t('account.passwordTab.passwordConfirmation')} *
                </label>

                <Input
                  {...form.register('passwordConfirmation')}
                  id="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={
                    isFormControlInvalid('passwordConfirmation', 'passwordConfirmation')
                      ? 'true'
                      : undefined
                  }
                  onKeyDown={() => clearServerErrors('passwordConfirmation')}
                />

                {controlErrors('passwordConfirmation')}
              </div>
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
