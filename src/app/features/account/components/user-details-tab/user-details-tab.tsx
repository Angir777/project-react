import { useCallback, useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { isAxiosError } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCircleCheck,
  faCircleExclamation,
  faEnvelope,
  faTrash,
  faUserXmark,
} from '@fortawesome/free-solid-svg-icons';
import { Input } from '@/shadcn/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shadcn/components/ui/tooltip';
import { cn } from '@/shadcn/lib/utils';
import { credentialsService, type Credentials } from '@/core/services/credentials.service';
import { useBaseUpdate } from '@/shared/components/base-components/use-base-update';
import { Loader } from '@/shared/components/ui/loader/loader';
import { SaveButton } from '@/shared/components/ui/save-button/save-button';
import { Validators } from '@/shared/helpers/validators';
import type { User } from '@/shared/interfaces';
import {
  accountService,
  authenticationService,
  toastService,
  translatedSwalService,
} from '@/shared/services';
import { formatDate } from '@/shared/utils';

const schema = yup.object({
  // The email control is disabled, so (as in Angular) its validators are not evaluated.
  email: yup.string().default(''),
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
});

type UserDetailsForm = yup.InferType<typeof schema>;

export function UserDetailsTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // User
  const [user, setUser] = useState<User | null>(null);

  // Avatar
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removeAvatarRequested, setRemoveAvatarRequested] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  // Account deletion
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Resend activation email
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);

  // Form
  const form = useForm<UserDetailsForm>({
    resolver: yupResolver(schema),
    mode: 'onTouched',
    defaultValues: { email: '', firstName: '', lastName: '' },
  });

  const {
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    setServerErrors,
    getServerErrors,
    clearServerErrors,
    isFormControlInvalid,
    controlErrors,
  } = useBaseUpdate(form);

  // Update form fields
  const updateForm = useCallback(
    (model: User) => {
      form.reset({
        email: model.email,
        firstName: model.firstName,
        lastName: model.lastName,
      });

      setRemoveAvatarRequested(false);
      setAvatarPreview(model.avatarUrl);
    },
    [form],
  );

  // Fetch the current user
  useEffect(() => {
    setIsLoading(true);

    authenticationService
      .getCurrentUser()
      .then((res) => {
        if (res.data) {
          setUser(res.data);

          // Update the form
          updateForm(res.data);
        }
      })
      .catch(() => toastService.show('error', 'main.global.message.error.cantGetData'))
      .finally(() => setIsLoading(false));
  }, [setIsLoading, updateForm]);

  /**
   * Avatar
   */

  const onDropzoneClick = () => {
    if (isSaving) {
      return;
    }

    fileInput.current?.click();
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();

    if (!isSaving) {
      setIsDragOver(true);
    }
  };

  const onDragLeave = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleAvatarFile = (file: File) => {
    clearServerErrors('avatar');

    if (!file.type.startsWith('image/')) {
      toastService.show('error', 'account.message.error.avatarMustBeImage');

      return;
    }

    setRemoveAvatarRequested(false);
    setSelectedAvatar(file);

    const reader = new FileReader();

    reader.onload = () => {
      setAvatarPreview(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const onFileDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    if (isSaving) {
      return;
    }

    const file = event.dataTransfer?.files?.[0];

    if (file) {
      handleAvatarFile(file);
    }
  };

  const removeAvatar = () => {
    setSelectedAvatar(null);
    setRemoveAvatarRequested(true);
    setAvatarPreview(null);
  };

  /**
   * Save
   */

  // Build the object to save from the form
  const createDataToSaveFromForm = (): FormData => {
    const formValue = form.getValues();

    const formData = new FormData();

    formData.append('firstName', formValue.firstName);
    formData.append('lastName', formValue.lastName);

    if (selectedAvatar) {
      formData.append('avatar', selectedAvatar);
    }

    formData.append('removeAvatar', removeAvatarRequested ? 'true' : 'false');

    return formData;
  };

  // Called when the API returns OK
  const onSaveSuccess = (model: User) => {
    if (!model) {
      return;
    }

    // Refresh the avatar in the header
    const currentCredentials = credentialsService.credentials;

    if (currentCredentials) {
      const credentials: Credentials = {
        ...currentCredentials,
        firstName: model.firstName ?? '',
        lastName: model.lastName ?? '',
        avatarUrl: model.avatarUrl ?? null,
      };

      credentialsService.setCredentials(credentials);
    }

    // Refresh the form
    setUser(model);
    updateForm(model);
    setSelectedAvatar(null);

    void translatedSwalService.show('success', 'account.message.success.updatedSuccessfully', {});
  };

  // Called when the API returns an error
  const onSaveError = (errorRes: unknown) => {
    if (isAxiosError(errorRes) && errorRes.response?.data?.errors != null) {
      setServerErrors(errorRes.response.data.errors);
    }

    void translatedSwalService.show('error', 'account.message.error.cantUpdate', {});
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
      const res = await accountService.updateDetailsUser(dataToSave);
      onSaveSuccess(res.data);
    } catch (err) {
      onSaveError(err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Resend activation email
   */
  const resendConfirmationEmail = () => {
    if (isResendingConfirmation || isSaving) {
      return;
    }

    setIsResendingConfirmation(true);

    accountService
      .resendConfirmationEmail()
      .then(() => {
        void translatedSwalService.show(
          'success',
          'account.message.success.resendingConfirmationSuccessfully',
          {},
        );
      })
      .catch((errorRes) => {
        const message = isAxiosError(errorRes) ? errorRes.response?.data?.message : undefined;

        if (message === 'EMAIL_HAS_BEEN_SENT') {
          void translatedSwalService.show(
            'warning',
            'account.message.warning.cantResendingConfirmationAgain',
            {},
          );
        } else if (message === 'EMAIL_ALREADY_CONFIRMED') {
          void translatedSwalService.show(
            'info',
            'account.message.info.cantResendingConfirmationEmailConfirmed',
            {},
          );
        } else {
          void translatedSwalService.show(
            'error',
            'account.message.error.cantResendingConfirmation',
            {},
          );
        }
      })
      .finally(() => setIsResendingConfirmation(false));
  };

  /**
   * Delete account
   */
  const deleteAccount = async () => {
    if (isDeletingAccount || isSaving) {
      return;
    }

    const result = await translatedSwalService.showAsync(
      'account.message.question.areYouSureYouWantDeleteAccount',
      {},
      {
        icon: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonTextTranslation: 'main.global.yes',
        cancelButtonTextTranslation: 'main.global.no',

        // RedAlert
        iconColor: '#ffffff',
        background: '#e7000b',
        color: '#ffffff',
        customClass: {
          confirmButton: 'swal-delete-confirm',
          cancelButton: 'swal-delete-cancel',
        },
      },
    );

    if (result.value) {
      setIsDeletingAccount(true);

      try {
        await accountService.deleteAccount();

        void translatedSwalService.show(
          'success',
          'account.message.success.deletedSuccessfully',
          {},
        );

        // Log out of the application.
        authenticationService.logOut();
        // Redirect to the login page.
        navigate('/login');
      } catch (errorRes) {
        const message = isAxiosError(errorRes) ? errorRes.response?.data?.message : undefined;

        if (message === 'SUPER_ADMIN_CANT_DELETE_ACCOUNT') {
          void translatedSwalService.show(
            'error',
            'account.message.error.superAdminCantDeleteAccount',
            {},
          );
        } else {
          void translatedSwalService.show('error', 'account.message.error.cantDeleted', {});
        }
      } finally {
        setIsDeletingAccount(false);
      }
    }
  };

  const avatarServerErrors = getServerErrors('avatar');

  return (
    <form name="form" role="form" noValidate onSubmit={onSubmit}>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader isLoading={true} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Basic data */}
          <section className="rounded-lg border border-gray-200 p-5 dark:border-zinc-700 lg:col-span-2">
            <h6 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
              {t('account.detailsTab.basicData')}
            </h6>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  {t('user.form.email')}
                </label>

                <Input
                  {...form.register('email', { disabled: true })}
                  id="email"
                  type="email"
                  autoComplete="off"
                  aria-invalid={isFormControlInvalid('email', 'email') ? 'true' : undefined}
                  onKeyDown={() => clearServerErrors('email')}
                />

                {controlErrors('email')}
              </div>

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

              {/* Account confirmation status */}
              <div className="mt-2 flex items-center gap-2 text-sm">
                {user?.confirmed ? (
                  <>
                    <span className="inline-flex items-center gap-1.5 font-medium text-green-600 dark:text-green-400">
                      <FontAwesomeIcon icon={faCircleCheck} />

                      {t('account.detailsTab.accountConfirmed')}
                    </span>

                    {user?.emailVerifiedAt && (
                      <span className="text-gray-500 dark:text-gray-400">
                        — {formatDate(user.emailVerifiedAt)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-medium text-amber-600 dark:text-amber-400">
                    <FontAwesomeIcon icon={faCircleExclamation} />

                    {t('account.detailsTab.accountNotConfirmed')}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Avatar */}
          <section className="rounded-lg border border-gray-200 p-5 dark:border-zinc-700">
            <h6 className="mb-6 text-base font-semibold text-gray-800 dark:text-white/90">
              {t('account.detailsTab.avatar')}
            </h6>

            <div className="flex flex-col items-center text-center">
              {/* Avatar preview */}
              <div className="relative shrink-0">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-gray-100 dark:ring-zinc-800"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gray-100 text-3xl font-semibold text-gray-500 ring-4 ring-gray-50 dark:bg-zinc-800 dark:text-gray-300 dark:ring-zinc-900">
                    {user?.firstName?.charAt(0)} {user?.lastName?.charAt(0)}
                  </div>
                )}

                {avatarPreview && !selectedAvatar && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="absolute -right-1 -top-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-200 bg-white text-red-600 shadow-sm transition-colors hover:bg-red-50 dark:border-red-900 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950 cursor-pointer"
                        disabled={isSaving}
                        onClick={(event) => {
                          removeAvatar();
                          event.stopPropagation();
                        }}
                        aria-label={t('account.detailsTab.removeAvatar')}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">{t('main.global.tooltip.delete')}</TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Dropzone */}
              <div
                className={cn('mt-6 w-full', isSaving && 'cursor-not-allowed opacity-60')}
                role="button"
                tabIndex={0}
                onClick={onDropzoneClick}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    onDropzoneClick();
                  }
                }}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onFileDrop}
              >
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  disabled={isSaving}
                  onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                      handleAvatarFile(file);
                    }
                  }}
                />

                {!selectedAvatar ? (
                  <div
                    className={cn(
                      'flex min-h-40 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center transition-all hover:border-brand-500 hover:bg-brand-50/50 dark:border-zinc-600 dark:hover:border-brand-500 dark:hover:bg-brand-950/20 cursor-pointer',
                      isDragOver && 'border-brand-500 bg-brand-50 dark:bg-brand-950/20',
                    )}
                  >
                    <FontAwesomeIcon
                      icon={faCamera}
                      className={cn(
                        'text-3xl text-gray-400 transition-colors dark:text-gray-500',
                        isDragOver && 'text-brand-500',
                      )}
                    />

                    <div className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {t('account.detailsTab.changeAvatar')}
                    </div>

                    <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      {t('account.detailsTab.avatarFormat')}
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-24 w-full items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50 cursor-pointer">
                    <div className="shrink-0">
                      {avatarPreview && (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate text-sm font-medium text-gray-900 dark:text-white">
                        {selectedAvatar?.name}
                      </div>

                      {avatarServerErrors.length > 0 && (
                        <div className="mt-1 text-xs text-red-600 dark:text-red-400">
                          {avatarServerErrors[0]}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-600 transition-colors hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950 cursor-pointer"
                      disabled={isSaving}
                      onClick={(event) => {
                        removeAvatar();
                        event.stopPropagation();
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-end mt-4">
        {/* Save */}
        {!isLoading && <SaveButton type="submit" loading={isSaving} />}
      </div>

      {/* Resend activation email */}
      {!isLoading && !user?.confirmed && (
        <section className="mt-6 overflow-hidden rounded-lg border border-amber-200 dark:border-amber-900/60">
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-4 dark:border-amber-900/60 dark:bg-amber-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>

              <div>
                <h6 className="text-base font-semibold text-amber-700 dark:text-amber-400">
                  {t('account.detailsTab.accountVerification')}
                </h6>

                <p className="mt-0.5 text-sm text-amber-600/80 dark:text-amber-400/80">
                  {t('account.detailsTab.resendConfirmationDescription')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white px-5 py-4 dark:bg-zinc-900">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 cursor-pointer"
              disabled={isSaving || isResendingConfirmation}
              onClick={resendConfirmationEmail}
            >
              {isResendingConfirmation ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              ) : (
                <FontAwesomeIcon icon={faEnvelope} />
              )}

              {t('account.detailsTab.resendConfirmationEmail')}
            </button>
          </div>
        </section>
      )}

      {/* Account deletion zone */}
      {!isLoading && (
        <section className="mt-6 overflow-hidden rounded-lg border border-red-200 dark:border-red-900/60">
          <div className="border-b border-red-200 bg-red-50 px-5 py-4 dark:border-red-900/60 dark:bg-red-950/20">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <FontAwesomeIcon icon={faUserXmark} />
              </div>

              <div>
                <h6 className="text-base font-semibold text-red-700 dark:text-red-400">
                  {t('account.detailsTab.dangerZone')}
                </h6>

                <p className="mt-0.5 text-sm text-red-600/80 dark:text-red-400/80">
                  {t('account.detailsTab.deleteAccountDescription')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white px-5 py-4 dark:bg-zinc-900">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800 cursor-pointer"
              disabled={isSaving || isDeletingAccount}
              onClick={deleteAccount}
            >
              {isDeletingAccount ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
              ) : (
                <FontAwesomeIcon icon={faTrash} />
              )}

              {t('account.detailsTab.deleteAccount')}
            </button>
          </div>
        </section>
      )}
    </form>
  );
}
