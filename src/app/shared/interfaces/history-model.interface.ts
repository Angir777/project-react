/* eslint-disable @typescript-eslint/no-explicit-any */
export interface HistoryModel {
  id: number;
  diff: Record<string, any>;
  changedByUserId: number;
  changedByUserName: string;
  changedByUserEmail: string;
  actionType: string;
  ip: string;
  createdAt: string;
}

export interface RoleHistory extends HistoryModel {
  role_id: number;
}

export interface UserHistory extends HistoryModel {
  user_id: number;
}
