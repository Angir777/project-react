/**
 * Preparing sorting parameters.
 *
 * @param sortBy
 * @param direction
 */
export const prepareSortParams = (sortBy: string | null, direction: string | null) => {
  if (sortBy === null || direction === null) {
    return;
  }

  if (direction === 'asc') {
    return sortBy;
  } else {
    return `-${sortBy}`;
  }
};
