import { useTranslation } from 'react-i18next';
import { formatDate } from '@/shared/utils';
import {
  HistoryObjectBase,
  type HistoryObjectProps,
} from '../../history-modal-base/history-object-base';

export function UserHistoryObject(props: HistoryObjectProps) {
  const { t } = useTranslation();

  // A comment starting with 'COMMENT_' has translated text
  const getHistoryValue = (value: unknown): string => {
    if (typeof value === 'string' && value.startsWith('COMMENT_')) {
      return t('user.history.comment.' + value);
    }

    return value?.toString() || '-';
  };

  const renderValue = (fullKey: string, value: unknown) => {
    // DATE FORMAT
    if (fullKey === 'emailVerifiedAt' || fullKey === 'deletedAt') {
      return <strong>{value ? formatDate(value as string) : '-'}</strong>;
    }

    // TRUE/FALSE
    if (fullKey === 'confirmed') {
      return <strong>{value ? t('main.global.yes') : t('main.global.no')}</strong>;
    }

    return getHistoryValue(value);
  };

  return (
    <HistoryObjectBase
      {...props}
      translationPrefix="user.history."
      renderValue={renderValue}
      self={UserHistoryObject}
    />
  );
}
