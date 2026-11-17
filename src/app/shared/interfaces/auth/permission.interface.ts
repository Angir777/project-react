/**
 * Permission model interface.
 */
export interface PermissionGroup {
  name: string;
  translatedName: string;
}

export interface Permission {
  id: number;
  name: string;
  translatedName: string;

  groupName: string;

  isSelected?: boolean;
}
