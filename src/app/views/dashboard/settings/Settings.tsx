import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { TabView, TabPanel } from 'primereact/tabview';
import { setPageTitle } from '../../../utils/page-title.utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import * as yup from 'yup';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { toastActions } from '../../../core/redux/toast';
import SettingService from '../../../services/setting/setting.service';
import { authActions } from '../../../core/redux/auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { Password } from 'primereact/password';
import { useForm } from 'react-hook-form';
import { ChangePasswordInterface } from '../../../interfaces/change-password.interface';

const schema = yup.object().shape({
  old_password: yup.string().required('validation.required'),
  password: yup
    .string()
    .required('validation.required')
    .min(6, 'validation.minLength') // Minimalna długość 6 znaków
    .max(191, 'validation.maxLength'), // Ograniczenie do 191 znaków
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'validation.passwordMustMatch') // Sprawdzenie zgodności z hasłem
    .required('validation.required'),
});

const Settings: FC = () => {
  const dispatch = setGlobalState();
  const { t } = useTranslation();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordInterface>({
    resolver: yupResolver(schema),
    defaultValues: {
      old_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  useEffect(() => {
    // Ustawienie title strony
    setPageTitle('settings.title');
  });

  // Zmiana hasła
  const onSubmit = async (formData: ChangePasswordInterface) => {
    setIsChangingPassword(true);

    try {
      await SettingService.changePassword({
        ...formData,
      });

      // Hasło zostało pomyślnie zmienione!
      dispatch(
        toastActions.showToast({
          severity: 'success',
          summary: t('toast.summary.success'),
          detail: t('settings.messages.success.passwordChangeSuccess'),
        })
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.error === 'WRONG_OLD_PASSWORD') {
        // Podano błędne aktualne hasło!
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('settings.messages.errors.wrongOldPassword'),
          })
        );
      } else {
        // Wystapił błąd podczas zmiany hasła. Spróbuj ponownie.
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('settings.messages.errors.cantChangePassword'),
          })
        );
      }
    }

    // Zresetowanie formularza
    reset();

    setIsChangingPassword(false);
  };

  // Usunięcie konta
  const deleteAccount = useCallback(async () => {
    const result = await Swal.fire({
      icon: 'question',
      iconColor: '#ff3d41',
      title: t('settings.messages.questions.areYouShureToDeleteAccountText', {}),
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: t('global.buttons.no'),
      confirmButtonText: t('global.buttons.yes'),
    });
    if (result.value) {
      setIsDeletingAccount(true);

      try {
        await SettingService.deleteAccount();

        dispatch(
          toastActions.showToast({
            severity: 'success',
            summary: t('toast.summary.success'),
            detail: t('settings.messages.success.deletedYourAccountTitle'),
          })
        );

        dispatch(authActions.logout());
      } catch {
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('settings.messages.errors.anotherDeleteErrorText'),
          })
        );
      }

      setIsDeletingAccount(false);
    }
  }, [t]);

  return (
    <>
      <PageHeading title={t('settings.title')} />

      <PageContentWrapper>
        <TabView>
          <TabPanel header={t('settings.buttons.access')}>
            <div className="row">
              <div className="col-12">
                <h5 className="m-0 mb-2">{t('settings.buttons.changePassword')}</h5>
              </div>
              <div className="col-12">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div>
                    <div className="field p-fluid mt-3">
                      <label htmlFor="old_password">{t('settings.form.oldPassword')}*</label>
                      <Password
                        id="old_password"
                        value={watch('old_password')}
                        onChange={(e) => setValue('old_password', e.target.value)}
                        feedback={false}
                        toggleMask
                        className={`${errors.old_password ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('settings.form.oldPassword')}
                      />
                      {errors.old_password && <small className="p-error">{t(errors.old_password.message || '')}</small>}
                    </div>

                    <div className="field p-fluid mt-3">
                      <label htmlFor="password">{t('settings.form.password')}*</label>
                      <Password
                        id="password"
                        value={watch('password')}
                        onChange={(e) => setValue('password', e.target.value)}
                        feedback={false}
                        toggleMask
                        className={`${errors.password ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('settings.form.password')}
                      />
                      {errors.password && <small className="p-error">{t(errors.password.message || '')}</small>}
                    </div>

                    <div className="field p-fluid mt-3">
                      <label htmlFor="password_confirmation">{t('settings.form.passwordConfirmation')}*</label>
                      <Password
                        id="password_confirmation"
                        value={watch('password_confirmation')}
                        onChange={(e) => setValue('password_confirmation', e.target.value)}
                        feedback={false}
                        toggleMask
                        className={`${errors.password_confirmation ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('settings.form.passwordConfirmation')}
                      />
                      {errors.password_confirmation && <small className="p-error">{t(errors.password_confirmation.message || '')}</small>}
                    </div>
                  </div>

                  <div className="mt-4">
                    <button type="submit" className="btn btn-success btn-sm" disabled={isChangingPassword}>
                      {!isChangingPassword ? <FontAwesomeIcon icon={faSave} /> : <FontAwesomeIcon icon={faSpinner} spin />}
                      <span className="ms-2">{t('settings.buttons.confirm')}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </TabPanel>
          <TabPanel header={t('settings.buttons.account')}>
            <div className="row">
              <div className="col-12">
                <h5 className="m-0 mb-4">{t('settings.buttons.deleteAccount')}</h5>
                <button type="button" className="btn btn-danger btn-sm" disabled={isDeletingAccount} onClick={() => deleteAccount()}>
                  {!isDeletingAccount ? <FontAwesomeIcon icon={faTrash} /> : <FontAwesomeIcon icon={faSpinner} spin />}
                  <span className="ms-2">{t('settings.buttons.confirm')}</span>
                </button>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </PageContentWrapper>
    </>
  );
};
export default Settings;
