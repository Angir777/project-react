/**
 * Interfejs określający "kształt" wymaganych danych podczas tworzenia menu głównego.
 */
export interface NavItem {
  label: string;
  permissions: string[];
  permissionsMode: string;
  items?: NavItem[];
  icon?: string;
  to?: string;
  hasChildren?: boolean;
  separator?: boolean;
}
