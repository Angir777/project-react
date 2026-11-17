export const PermissionModes = {
  ALL: 'ALL',
  AT_LEAST_ONE: 'AT_LEAST_ONE',
  EXCEPT_ALL: 'EXCEPT_ALL',
  EXCEPT_AT_LEAST_ONE: 'EXCEPT_AT_LEAST_ONE',
} as const;

export type PermissionModes = (typeof PermissionModes)[keyof typeof PermissionModes];
