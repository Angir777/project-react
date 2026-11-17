import type { BaseModel } from '../base-model.interface';
import type { Role } from '../role/role.interface';

/**
 * User model interface.
 */
export interface User extends BaseModel {
  firstName: string;
  lastName: string;
  email: string;
  roles?: Role[];

  emailVerifiedAt: string | null;
  confirmed: string;

  fullName: string;
  fullNameWithEmail?: string;

  avatarUrl: string | null;
}

export interface SimpleUser extends BaseModel {
  fullName: string;
  email: string;
}

export type UserId = number | string | null;

export interface UserSetting {
  name: string;
  value: boolean;
  translatedName: string;
  translatedDescription: string;
}

export type UserSettings = Record<string, UserSetting>;
