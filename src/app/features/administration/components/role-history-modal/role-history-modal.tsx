import { roleService } from '@/shared/services/role/role.service';
import { HistoryModalBase } from '../history-modal-base/history-modal-base';
import { RoleHistoryObject } from './role-history-object/role-history-object';

export function RoleHistoryModal() {
  return <HistoryModalBase getHistory={roleService.getHistory} historyObject={RoleHistoryObject} />;
}
