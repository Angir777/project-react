/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from '@/core/interceptors';
import type { User, UserId } from '../../interfaces';
import { createRestService } from '../base-rest.service';

const base = createRestService<User>('user');

/**
 * Equivalent of the Angular UserService (extends BaseRestService<User>).
 */
export const userService = {
  ...base,

  // Restore a user.
  restore(id: any) {
    return http.delete<User>(`${base.resourceUrl}/${id}/restore`);
  },

  // Assign roles.
  async attachRoles(userId: UserId, selectedRolesIds: number[]): Promise<User> {
    const body = {
      selectedRolesIds,
    };

    const res = await http.put<User>(`${base.resourceUrl}/attach-roles/${userId}`, body);
    return res.data;
  },
};
