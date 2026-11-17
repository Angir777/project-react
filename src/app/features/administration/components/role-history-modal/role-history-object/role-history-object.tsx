import {
  HistoryObjectBase,
  type HistoryObjectProps,
} from '../../history-modal-base/history-object-base';

const renderValue = (_fullKey: string, value: unknown) => (
  <strong>{(value as string | number | null | undefined) || '-'}</strong>
);

export function RoleHistoryObject(props: HistoryObjectProps) {
  return (
    <HistoryObjectBase
      {...props}
      translationPrefix="role.history."
      renderValue={renderValue}
      self={RoleHistoryObject}
    />
  );
}
