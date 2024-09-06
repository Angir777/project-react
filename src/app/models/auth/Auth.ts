import { Permission } from './Permission';

export interface Credentials {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  confirmed: boolean;
  permissions: Permission[];
  token: UserToken;
  tokenType: string;
  localAccount: boolean;
  avatarUrl?: string;
}

export interface UserToken {
  accessToken: string;
  expiresAt: string;
  revoked: string;
  updatedAt: string;
}