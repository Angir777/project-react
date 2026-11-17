import { userService } from '@/shared/services/user/user.service';
import { HistoryModalBase } from '../history-modal-base/history-modal-base';
import { UserHistoryObject } from './user-history-object/user-history-object';

export function UserHistoryModal() {
  return <HistoryModalBase getHistory={userService.getHistory} historyObject={UserHistoryObject} />;
}
