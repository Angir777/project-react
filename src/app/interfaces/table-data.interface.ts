import { User } from "../models/user/User";

/**
 * Interfejs określający "kształt" wymaganych danych na tabeli.
 */
export interface TableDataInterface {
  items: User[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  lastPage: number;
}
