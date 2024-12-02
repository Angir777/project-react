import { Permission } from '../auth/Permission';
import { BaseModel } from '../BaseModel';

/**
 * Model użytkownika.
 */
export class User extends BaseModel {
  confirmed: boolean = false;
  email: string | null = null;
  name: string | null = null;

  permissions: Permission[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  roles: any[] = [];
}
