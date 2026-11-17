import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind classes (equivalent of zardui `mergeClasses`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
