import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isAxiosError } from 'axios';
import { Input } from '@/shadcn/components/ui/input';
import { Switch } from '@/shadcn/components/ui/switch';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { CancelButton } from '@/shared/components/ui/cancel-button/cancel-button';
import { Loader } from '@/shared/components/ui/loader/loader';
import { PageSection } from '@/shared/components/ui/page-section/page-section';
import { SaveButton } from '@/shared/components/ui/save-button/save-button';
import { Validators, emailValidator } from '@/shared/helpers/validators';
import type { User } from '@/shared/interfaces';
import { toastService, translatedSwalService, userService } from '@/shared/services';
import { formatDate } from '@/shared/utils';

const schema = yup.object({
  firstName: yup
    .string()
    .default('')
    .required(Validators.required)
    .max(191, Validators.maxLength(191)),
  lastName: yup
    .string()
    .default('')
    .required(Validators.required)
    .max(191, Validators.maxLength(191)),
  email: emailValidator(
    yup.string().default('').required(Validators.required).max(191, Validators.maxLength(191)),
  ),
  confirmed: yup.boolean().default(false).required(Validators.required),
});

type UpdateUserForm = yup.InferType<typeof schema>;

export function UpdateUser() {
  const { t } = useTranslation();
  const { id } = useParams();

  // User
  const [user, setUser] = useState<User | null>(null);

  // Account verification date
  const [emailVerifiedAt, setEmailVerifiedAt] = useState<string | null>(null);

  // Form
  const form = useForm<UpdateUserForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { firstName: '', lastName: '', email: '', confirmed: false },
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

  // Create or Update: fetch model data
  useEffect(() => {
    if (id == null) {
      return;
    }

    setIsLoading(true);

    userService
      .getById(id)
      .then((res) => {
        if (res.data !== null) {
          setUser(res.data);

          // Update the form
          form.reset({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            confirmed: !!res.data.confirmed,
          });

          setEmailVerifiedAt(res.data.emailVerifiedAt);
        }
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [id, form, setIsLoading]);

  // Build the object to save from the form
  const createDataToSaveFromForm = (): User => {
    const formValue = form.getValues();

    return {
      id: user?.id,
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      confirmed: formValue.confirmed,
    } as unknown as User;
  };

  // Call save
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validation
    const valid = await form.trigger();
    if (!valid) {
      toastService.show('error', 'main.global.validation.formNotCorrect');
      return;
    }

    // Object to save
    const dataToSave = createDataToSaveFromForm();

    setIsSaving(true);

    try {
      if (user === null) {
        await userService.create(dataToSave);
      } else {
        await userService.update(dataToSave);
      }

      // Called when the API returns OK
      void translatedSwalService.show(
        'success',
        'user.message.success.createdUpdatedSuccessfully',
        {},
      );

      previousState();
    } catch (errorRes) {
      // Called when the API returns an error
      if (isAxiosError(errorRes) && errorRes.response?.data?.errors != null) {
        setServerErrors(errorRes.response.data.errors);
      }

      void translatedSwalService.show('error', 'user.message.error.cantCreateUpdate', {});
    } finally {
      setIsSaving(false);
    }
  };

  // Actions
  const actionsButtons = (
    <>
      {/* Save */}
      {!isLoading && <SaveButton type="submit" loading={isSaving} />}
      {/* Back */}
      <CancelButton />
    </>
  );

  return (
    <form name="form" role="form" noValidate onSubmit={onSubmit}>
      <PageSection
        title={user?.id ? t('user.pageTitle.edit') : t('user.pageTitle.add')}
        actions={actionsButtons}
        footerClassName="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 dark:border-zinc-800 sm:flex-row sm:justify-end"
      >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader isLoading={true} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* First name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t('user.form.firstName')} *
              </label>

              <Input
                {...form.register('firstName')}
                id="firstName"
                type="text"
                autoComplete="off"
                aria-invalid={isFormControlInvalid('firstName', 'firstName') ? 'true' : undefined}
                onKeyDown={() => clearServerErrors('firstName')}
              />

              {controlErrors('firstName')}
            </div>

            {/* Last name */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t('user.form.lastName')} *
              </label>

              <Input
                {...form.register('lastName')}
                id="lastName"
                type="text"
                autoComplete="off"
                aria-invalid={isFormControlInvalid('lastName', 'lastName') ? 'true' : undefined}
                onKeyDown={() => clearServerErrors('lastName')}
              />

              {controlErrors('lastName')}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t('user.form.email')} *
              </label>

              <Input
                {...form.register('email')}
                id="email"
                type="email"
                autoComplete="off"
                aria-invalid={isFormControlInvalid('email', 'email') ? 'true' : undefined}
                onKeyDown={() => clearServerErrors('email')}
              />

              {controlErrors('email')}
            </div>

            {/* Account confirmed */}
            <div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-4 dark:border-zinc-700">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {t('user.form.confirmed')}
                  </div>

                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {emailVerifiedAt ? formatDate(emailVerifiedAt) : t('user.form.notConfirmed')}
                  </div>
                </div>

                <Controller
                  control={form.control}
                  name="confirmed"
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        field.onBlur();
                      }}
                    />
                  )}
                />
              </div>

              {controlErrors('confirmed')}
            </div>
          </div>
        )}
      </PageSection>
    </form>
  );
}
