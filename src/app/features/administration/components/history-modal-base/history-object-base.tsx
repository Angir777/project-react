/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shadcn/lib/utils';

export type HistoryObject = Record<string, any>;

export interface HistoryObjectProps {
  history: HistoryObject;
  border?: boolean;
  parentKey?: string;
}

interface HistoryObjectBaseProps extends HistoryObjectProps {
  translationPrefix: string;
  /** Renders the old/new value of an attribute (differs between user and role history). */
  renderValue: (fullKey: string, value: unknown) => ReactNode;
  /** Recursive component used for nested objects/arrays. */
  self: (props: HistoryObjectProps) => ReactNode;
}

const isArray = (obj: unknown): obj is unknown[] => Array.isArray(obj);

/**
 * Recursive diff renderer shared by `UserHistoryObject` and `RoleHistoryObject`.
 * Keys are iterated in their original order (Angular: keyvalue pipe with a no-op comparator).
 */
export function HistoryObjectBase({
  history,
  border = false,
  parentKey = '',
  translationPrefix,
  renderValue,
  self: Self,
}: HistoryObjectBaseProps) {
  const { t } = useTranslation();

  if (history === null || typeof history !== 'object') {
    return null;
  }

  // Returns the full translation key including parent keys, separated by underscores.
  const getFullKey = (key: string): string => (parentKey !== '' ? parentKey + '_' : '') + key;

  return (
    <table
      className={cn(
        'w-full text-sm',
        border ? 'border-collapse' : 'border-separate border-spacing-0',
      )}
    >
      <tbody>
        {Object.entries(history).map(([key, value]) => {
          const fullKey = getFullKey(key);
          const label = t(translationPrefix + fullKey);

          return (
            <tr key={key}>
              {/* ARRAY OF OBJECTS */}
              {isArray(value) && (
                <td colSpan={2} className="w-full px-2 py-1 align-top">
                  <strong> {label}: </strong>

                  {value.map((item, index) => (
                    <Fragment key={index}>
                      <Self history={item as HistoryObject} parentKey={fullKey} />

                      {index < value.length - 1 && <hr className="my-2 border-gray-200" />}
                    </Fragment>
                  ))}
                </td>
              )}

              {/* OBJECT AS A NESTED ELEMENT */}
              {value?.old === undefined && !isArray(value) && (
                <td colSpan={2} className="w-full px-2 py-1 align-top">
                  <strong> {label}: </strong>

                  <Self history={value} parentKey={fullKey} />
                </td>
              )}

              {/* ATTRIBUTES */}
              {value?.old !== undefined && !isArray(value) && (
                <>
                  {/* OLD DATA */}
                  <td className="w-1/2 px-2 py-1 align-top">
                    {label}: {renderValue(fullKey, value?.old)}
                  </td>

                  {/* NEW DATA */}
                  <td className="w-1/2 px-2 py-1 align-top">
                    {label}: {renderValue(fullKey, value?.new)}
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
