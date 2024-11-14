import { Permission } from '../auth/Permission';
import { BaseModel } from '../BaseModel';
import { Role } from '../role/Role';

/**
 * Model użytkownika.
 */
export class User extends BaseModel {
  confirmed: boolean = false;
  email: string | null = null;
  name: string | null = null;

  permissions: Permission[] = [];
  roles: Role[] = [];
}
