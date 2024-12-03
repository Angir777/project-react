import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { setPageTitle } from '../../../utils/page-title.utils';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Resolver, useForm } from 'react-hook-form';
import { RoleInterface } from '../../../interfaces/role.interface';
import { useNavigate, useParams } from 'react-router-dom';
import PermissionService from '../../../services/permission/permission.service';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { toastActions } from '../../../core/redux/toast';
import { Role } from '../../../models/role/Role';
import RoleService from '../../../services/role/role.service';
import { InputText } from 'primereact/inputtext';
import { goBack } from '../../../helpers/functions.helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Loader } from '../../../components/Loader';
import { PermissionGroup } from '../../../models/auth/PermissionGroup';
import { Permission } from '../../../models/auth/Permission';
import { InputSwitch } from 'primereact/inputswitch';

const schema = yup.object().shape({
  id: yup.number().nullable(),
  name: yup.string().required('validation.required'),
  guardName: yup.string().required('validation.required'),
});

const UpdateRole: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const [isSaving, setIsSaving] = useState(false);
  
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false);
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<Role | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RoleInterface>({
    resolver: yupResolver(schema) as Resolver<RoleInterface>,
    defaultValues: {
      id: null,
      name: '',
      guardName: 'web',
    },
  });

  // Wczytanie i przygotowanie danych
  useEffect(() => {
    const updateFormValues = (data: RoleInterface) => {
      setValue('id', data.id);
      setValue('name', data.name);
      setValue('guardName', data.guardName);
    };

    // Pobranie uprawnień
    const getPermissionGroups = async (role: Role | null = null) => {
      setIsLoadingPermissions(true);

      try {
        const res = await PermissionService.getPermissions();
        const tmpPermissions = res.data;
        if (tmpPermissions) {
          preparePermissionsToShow(tmpPermissions, role);
        }
      } catch {
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('roles.messages.error.noAccess'),
          })
        );
      }

      setIsLoadingPermissions(false);
    };

    // Pobranie roli
    const getRole = async () => {
      setIsLoading(true);

      try {
        const res = await RoleService.getById(id);
        setRole(res.data);
        updateFormValues(res.data);
        await getPermissionGroups(res.data);
      } catch {
        dispatch(
          toastActions.showToast({
            severity: 'error',
            summary: t('toast.summary.error'),
            detail: t('roles.messages.error.cantGetData'),
          })
        );
      }

      setIsLoading(false);
    };

    // Utworzenie czy aktualizacja
    if (id != null) {
      getRole();
      // Ustawienie title strony
      setPageTitle(t('roles.editTitle'));
    } else {
      getPermissionGroups();
      // Ustawienie title strony
      setPageTitle(t('roles.addTitle'));
    }
  }, []);

  // Zapis
  const onSubmit = (formData: RoleInterface) => {
    // Brak wybranych uprawnień
    if (preparePermissionsToSave().length == 0) {
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

  const create = async (formData: RoleInterface) => {
    setIsSaving(true);

    try {
      await RoleService.create({
        name: formData.name,
        guardName: formData.guardName,
        permissionIds: preparePermissionsToSave(),
      });

      // Rola została utworzona.
      dispatch(
        toastActions.showToast({
          severity: 'success',
          summary: t('toast.summary.success'),
          detail: t('roles.messages.success.createdRoleSuccess'),
        })
      );

      navigate('/dashboard/roles', { replace: true });
    } catch {
      // Rola nie została utworzona!
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('roles.messages.error.cantCreatedRole'),
        })
      );
    }

    setIsSaving(false);
  };

  const update = async (formData: RoleInterface) => {
    setIsSaving(true);

    try {
      await RoleService.update({
        id: formData.id,
        name: formData.name,
        guardName: formData.guardName,
        permissionIds: preparePermissionsToSave(),
      });

      // Rola została zaktualizowana.
      dispatch(
        toastActions.showToast({
          severity: 'success',
          summary: t('toast.summary.success'),
          detail: t('roles.messages.success.updatedRoleSuccess'),
        })
      );

      navigate('/dashboard/roles', { replace: true });
    } catch {
      // Rola nie została zaktualizowana!
      dispatch(
        toastActions.showToast({
          severity: 'error',
          summary: t('toast.summary.error'),
          detail: t('roles.messages.error.cantUpdatedRole'),
        })
      );
    }

    setIsSaving(false);
  };

  // Przygotowanie uprawnień do wyświetlenia
  const preparePermissionsToShow = (permissions: Permission[], role: Role | null) => {
    permissions.forEach((permission, index) => {
      const hasPerm = role !== null && hasPermission(permission, role?.permissions);
      permissions[index].isSelected = hasPerm;
    });
    setPermissionGroups(groupPermissions(permissions));
  };

  // Weryfikacja czy dana rola ma przypisane dane uprawnienie
  const hasPermission = (permission: Permission, permissions: Permission[]): boolean => {
    const index: number = permissions.findIndex((perm: Permission) => perm.id === permission.id);
    return index >= 0;
  };

  // Grupowanie uprawnień
  const groupPermissions = (permissions: Permission[]): PermissionGroup[] => {
    // Utwórz mapę do grupowania uprawnień
    const permissionGroupsMap = new Map<string, PermissionGroup>();

    permissions.forEach((permission) => {
      // Uzyskaj nazwę grupy z permissionGroupName
      const groupName = permission.permissionGroupName;

      if (groupName) {
        // Sprawdź, czy grupa już istnieje w mapie
        let permissionGroup = permissionGroupsMap.get(groupName);

        if (!permissionGroup) {
          // Jeśli grupa nie istnieje, utwórz nową
          permissionGroup = {
            name: groupName,
            permissions: [permission],
          };
          permissionGroupsMap.set(groupName, permissionGroup);
        } else {
          // Jeśli grupa istnieje, dodaj uprawnienie do grupy
          permissionGroup.permissions.push(permission);
        }
      }
    });

    // Konwertuj mapę na tablicę i zwróć
    return Array.from(permissionGroupsMap.values());
  };

  // Przygotowanie uprawnień do zapisu
  const preparePermissionsToSave = (): number[] => {
    let selectedPermissions: number[] = [];
    permissionGroups.forEach((permissionGroup: PermissionGroup) => {
      const selectedPermissionInGroup: number[] = permissionGroup.permissions
        .filter((permission: Permission) => permission.isSelected) // Filtracja tylko zaznaczonych
        .map((permission: Permission) => permission.id) // Mapowanie na id
        .filter((id): id is number => id !== null); // Usunięcie `null`
      selectedPermissions = selectedPermissions.concat(selectedPermissionInGroup);
    });
    return selectedPermissions;
  };

  return (
    <>
      <PageHeading title={id != null ? t('roles.editTitle', { name: role?.name }) : t('roles.addTitle')} />

      <PageContentWrapper>
        <div className="row">
          <div className="col-12">
            {isLoading ? (
              <Loader />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-3">
                  <div className="col-6">
                    <div className="field p-fluid">
                      <label htmlFor="name">{t('roles.form.name')}*</label>
                      <InputText
                        id="name"
                        {...register('name')}
                        className={`${errors.name ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('roles.form.name')}
                      />
                      {errors.name && <small className="p-error">{t(errors.name.message || '')}</small>}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="field p-fluid">
                      <label htmlFor="guardName">{t('roles.form.guardName')}*</label>
                      <InputText
                        id="guardName"
                        {...register('guardName')}
                        className={`${errors.guardName ? 'p-invalid' : ''} p-inputtext-sm`}
                        placeholder={t('roles.form.guardName')}
                        readOnly={true}
                      />
                      {errors.guardName && <small className="p-error">{t(errors.guardName.message || '')}</small>}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <hr className="hr-light" />
                </div>

                <div className="row mb-2">
                  <div className="col-12 mb-3">
                    <label className="label">{t('roles.form.permissionGroups')}*</label>
                  </div>
                  {isLoadingPermissions ? (
                    <Loader />
                  ) : permissionGroups?.length > 0 ? (
                    permissionGroups.map((permissionGroup: PermissionGroup, groupIndex: number) => (
                      <div key={groupIndex} className="col-12 col-sm-6 col-md-4">
                        <strong>{permissionGroup.name}</strong>
                        {permissionGroup.permissions?.map((permission: Permission, permIndex: number) => (
                          <div key={permIndex} className="form-group d-flex mt-3">
                            <InputSwitch
                              checked={permission.isSelected ?? false}
                              onChange={(e) => {
                                const updatedPermissionGroups = [...permissionGroups];
                                updatedPermissionGroups[groupIndex].permissions[permIndex].isSelected = e.value;
                                setPermissionGroups(updatedPermissionGroups);
                              }}
                            />
                            <label htmlFor={`permission-${permission.id}`} className="ms-2">{permission.name}</label>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="col-12">
                      <p>{t('roles.messages.error.noPermissions')}</p>
                    </div>
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
export default UpdateRole;
