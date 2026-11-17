import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import type { PermissionModes } from '../../constants';

export interface NavItem {
  name: string;
  icon?: string; // svg
  faIcon?: IconDefinition; // fontawesome

  path?: string;
  new?: boolean;

  permissions?: string[];
  permissionsMode?: PermissionModes;

  subItems?: NavSubItem[];
}

export interface NavSubItem {
  name: string;
  path: string;

  pro?: boolean;
  new?: boolean;

  permissions?: string[];
  permissionsMode?: PermissionModes;
}
