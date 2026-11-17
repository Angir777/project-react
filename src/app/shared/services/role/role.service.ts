import { http } from '@/core/interceptors';
import type { Permission, Role } from '../../interfaces';
import { createRestService } from '../base-rest.service';

const base = createRestService<Role>('role');

/**
 * Equivalent of the Angular RoleService (extends BaseRestService<Role>).
 */
export const roleService = {
  ...base,

  // Permissions.
  async getPermissions(): Promise<Permission[]> {
    const res = await http.get<Permission[]>(`${base.resourceUrl}/get-permissions`);
    return res.data;
  },
};
