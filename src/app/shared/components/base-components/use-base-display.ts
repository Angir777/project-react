import { useCallback, useState } from 'react';

/**
 * Equivalent of the Angular `BaseDisplayComponent`.
 */
export function useBaseDisplay() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Redirects to the previous page
   */
  const previousState = useCallback(() => window.history.back(), []);

  return { isLoading, setIsLoading, isSaving, setIsSaving, previousState };
}
