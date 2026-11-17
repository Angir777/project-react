export const Language = {
  PL: 'pl',
  EN: 'en',
  ES: 'es',
} as const;

export type Language = (typeof Language)[keyof typeof Language];
