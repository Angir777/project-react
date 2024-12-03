/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { getGlobalState, setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { User } from '../../../models/user/User';
import { Role } from '../../../models/role/Role';
import { yupResolver } from '@hookform/resolvers/yup';
import { Resolver, useForm } from 'react-hook-form';
import { UserInterface } from '../../../interfaces/user.interface';
import * as yup from 'yup';
import { toastActions } from '../../../core/redux/toast';
import RoleService from '../../../services/role/role.service';
import UserService from '../../../services/user/user.service';
import { Loader } from '../../../components/Loader';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
import { faSave, faSpinner, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { goBack } from '../../../helpers/functions.helpers';
import { hasPermissions } from '../../../utils/auth.utils';
import { InputSwitch } from 'primereact/inputswitch';

const schema = yup.object().shape({
  id: yup.number().nullable(),
  name: yup.string().required('validation.required').max(191, 'validation.maxLength'),
  email: yup.string().required('validation.required').email('validation.email'),
  confirmed: yup.boolean(),
});

const UpdateUser: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const [isSaving, setIsSaving] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser = getGlobalState((state: { auth: { currentUser: any } }) => state.auth.currentUser);
  const [canEditSuperAdminAccount, setCanEditSuperAdminAccount] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [isLoadingRoles, setIsLoadingRoles] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserInterface>({
    resolver: yupResolver(schema) as Resolver<UserInterface>,
    defaultValues: {
      id: null,
      name: '',
      email: '',
      confirmed: false,
    },
  });

  // Funkcja mapująca role z flagą `isSelected`
  const mapRolesWithSelection = (roles: Role[], userRoles: string[]): Role[] => {
    return roles.map((role) => ({
      ...role,
      isSelected: role.name !== null && userRoles.includes(role.name),
    }));
  };

  // Funkcja pobierająca role
  const fetchRoles = async (): Promise<Role[]> => {
    setIsLoadingRoles(true);
    try {
      const res = await RoleService.getAll();
      return res.data;
    } catch {
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('roles.messages.error.cantGetRoleData'),
        })
      );
      return [];
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Funkcja pobierająca użytkownika i jego role
  const fetchUserWithRoles = async (userId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const [userResponse, rolesResponse] = await Promise.all([UserService.getById(userId), fetchRoles()]);

      const fetchedUser = userResponse.data;
      const mappedRoles = mapRolesWithSelection(rolesResponse, fetchedUser.roles);

      setUser(fetchedUser);
      setRoles(mappedRoles);

      // Aktualizacja formularza
      updateFormValues(fetchedUser);
    } catch {
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('users.messages.error.cantGetData'),
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Aktualizacja formularza
  const updateFormValues = (fetchedUser: UserInterface) => {
    // Sprawdzenie, czy dane konto należy do super admina.
    // Jeśli tak to następuje sprawdzenie, czy zalogowany użytkownik może edytować takie konto.
    if (isSuperAdmin(fetchedUser.roles)) {
      // Jeśli nie ma uprawnień, to blokujemy dostęp.
      if (!canEditSuperAdminAccount) {
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('users.messages.errors.noPermissions'),
          })
        );
        navigate('/dashboard/users', { replace: true });
        return;
      }
    }

    // Aktualizacja formularza
    setValue('id', fetchedUser.id);
    setValue('name', fetchedUser.name);
    setValue('email', fetchedUser.email);
    setValue('confirmed', fetchedUser.confirmed);
  };

  // Obsługa efektów na starcie
  useEffect(() => {
    // Sprawdzenie, czy aktualnie zalogowany użytkownik ma rolę 'SUPER_ADMIN'.
    setCanEditSuperAdminAccount(hasPermissions(currentUser.permissions, ['SUPER_ADMIN']));

    if (id) {
      fetchUserWithRoles(id);
    } else {
      fetchRoles().then(setRoles);
    }
  }, [id]);

  // Zapis
  const onSubmit = (formData: UserInterface) => {
    // Brak wybranych uprawnień
    if (!hasSelectedRole()) {
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('roles.messages.error.needPermissions'),
        })
      );
      return;
    }

    if (id != null) {
      update(formData);
    } else {
      create(formData);
    }
  };

  const create = async (formData: UserInterface) => {
    setIsSaving(true);

    try {
      await UserService.create({
        name: formData.name,
        email: formData.email,
        confirmed: formData.confirmed,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        roles: roles
          .filter((r: any) => r.isSelected)
          .map((r: any) => {
            return r.name;
          }),
      });

      // Rola została utworzona.
      dispatch(
        toastActions.showToast({
          severity: 'success',
          summary: t('toast.summary.success'),
          detail: t('users.messages.success.createdUserSuccess'),
        })
      );

      navigate('/dashboard/users', { replace: true });
    } catch {
      // Rola nie została utworzona!
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('users.messages.error.cantCreatedUser'),
        })
      );
    }

    setIsSaving(false);
  };

  const update = async (formData: UserInterface) => {
    setIsSaving(true);

    try {
      await UserService.update({
        id: formData.id,
        name: formData.name,
        email: formData.email,
        confirmed: formData.confirmed,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        roles: roles
          .filter((r: any) => r.isSelected)
          .map((r: any) => {
            return r.name;
          }),
      });

      // Rola została zaktualizowana.
      dispatch(
        toastActions.showToast({
          severity: 'success',
          summary: t('toast.summary.success'),
          detail: t('users.messages.success.updatedUserSuccess'),
        })
      );

      navigate('/dashboard/users', { replace: true });
    } catch {
      // Rola nie została zaktualizowana!
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('users.messages.error.cantUpdatedUser'),
        })
      );
    }

    setIsSaving(false);
  };

  // Funkcja sprawdza, czu wybrany uzytkownik ma wybraną przynajmniej jedną rolę
  const hasSelectedRole = (): boolean => {
    if (!roles || roles.length === 0) return false;
    return roles.some((role) => role.isSelected);
  };

  // Zaznaczenie przypisanych aktualnie ról.
  // const prepareRolesToShow = (roles: Role[]) => {
  //   console.log('prepareRolesToShow');
  //   // const tmpRoles = [...roles];
  //   console.log(user?.roles);
  //   // const tmpUser = [...user];
  //   const updatedRoles = roles.map((role) => {
  //     // console.log("tu");
  //     return {
  //       ...role,
  //       isSelected: user !== null && role.name !== null && hasRole(role.name),
  //     };
  //   });

  //   console.log(updatedRoles);

  //   // Ustaw zaktualizowane role
  //   // console.log("Updated roles:", updatedRoles);
  //   setRoles(updatedRoles);
  //   // console.log("setRoles:", roles);
  // };

  // const hasRole = (roleName: string): boolean => {
  //   // Jeśli `role` jest obiektem `Role`, użyj jego `name`, w przeciwnym razie użyj bezpośrednio `role`.
  //   // console.log({
  //   //   "hasRole": roleName,
  //   //   "flaga": user?.roles?.includes(roleName) ?? false
  //   // });
  //   // Sprawdź, czy `user` istnieje i czy zawiera `roleName` w tablicy `roles`.

  //   return user?.roles?.includes(roleName) ?? false;
  // };

  // Sprawdzenie, czy dany użytkownik posiada rolę 'SUPER_ADMIN'.
  const isSuperAdmin = (roles: any) => {
    if (roles.indexOf('SUPER_ADMIN') !== -1) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <PageHeading title={id != null ? t('users.editTitle', { name: user?.name }) : t('users.addTitle')} />

      <PageContentWrapper>
        <div className="row">
          <div className="col-12">
            {isLoading ? (
              <Loader />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                  <div className="col-4">
                    <div className="field p-fluid">
                      <label htmlFor="name">{t('users.form.name')}*</label>
                      <InputText
                        id="name"
                        {...register('name')}
                        className={`${errors.name ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('users.form.name')}
                      />
                      {errors.name && <small className="p-error">{t(errors.name.message || '')}</small>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="field p-fluid">
                      <label htmlFor="email">{t('users.form.email')}*</label>
                      <InputText
                        id="email"
                        {...register('email')}
                        className={`${errors.email ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('users.form.email')}
                      />
                      {errors.email && <small className="p-error">{t(errors.email.message || '')}</small>}
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="field p-fluid">
                      <label htmlFor="confirmed">
                        {t('users.form.confirmed')}
                      </label>
                      <div>
                        <Checkbox inputId="confirmed" checked={!!watch('confirmed')} onChange={(e) => setValue('confirmed', e.checked || false)} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <hr className="hr-light" />
                </div>

                <div className="row mb-2">
                  <div className="col-12 mb-3">
                    <label className="label">{t('users.form.roles')}*</label>
                  </div>
                  {isLoadingRoles ? (
                    <></>
                  ) : roles.length > 0 ? (
                    roles.map((role, index) => (
                      <div key={role.id} className="d-flex align-items-center mb-2">
                        <InputSwitch
                          checked={role.isSelected ?? false}
                          onChange={(e) => {
                            // Aktualizuj lokalną tablicę `roles`
                            const updatedRoles = [...roles];
                            updatedRoles[index].isSelected = e.value;
                            setRoles(updatedRoles); // Funkcja do aktualizacji stanu
                          }}
                        />
                        <label htmlFor={`role-${role.id}`} className="ms-2">{role.name}</label>
                      </div>
                    ))
                  ) : (
                    <p>{t('users.messages.error.noRoles')}</p>
                  )}
                </div>

                <div className="mt-4 d-flex justify-content-end">
                  <button type="submit" className="btn btn-success btn-sm ms-2" disabled={isSaving}>
                    {!isSaving ? <FontAwesomeIcon icon={faSave} /> : <FontAwesomeIcon icon={faSpinner} spin />}
                    <span className="ms-2">{t('global.buttons.save')}</span>
                  </button>

                  <button type="button" onClick={goBack} className="btn btn-secondary btn-sm ms-2">
                    <FontAwesomeIcon icon={faArrowLeftLong} />
                    <span className="ms-2">{t('global.buttons.cancel')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </PageContentWrapper>
    </>
  );
};
export default UpdateUser;
