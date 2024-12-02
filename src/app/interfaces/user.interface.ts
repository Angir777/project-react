import { Role } from "../models/role/Role";

/**
 * Interfejs określający "kształt" wymaganych danych dla usera.
 */
export interface UserInterface {
  id: number | null;
  name: string;
  email: string;
  confirmed: boolean;

  roles?: Role[];
}
