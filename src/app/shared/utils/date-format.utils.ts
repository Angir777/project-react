import dayjs from 'dayjs';
import { environment } from '@environments';

/**
 * Equivalent of the Angular `DatePipe` used in templates
 * (`date: environment.DATETIME_DISPLAY_HISTORY_FORMAT`).
 * Angular date tokens (yyyy, dd) are mapped to dayjs tokens (YYYY, DD).
 */
export const formatDate = (
  value: string | number | Date | null | undefined,
  format: string = environment.DATETIME_DISPLAY_HISTORY_FORMAT,
): string => {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const date = dayjs(value);

  if (!date.isValid()) {
    return '';
  }

  return date.format(format.replace(/y/g, 'Y').replace(/d/g, 'D'));
};
