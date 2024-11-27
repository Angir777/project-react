import { Card } from 'primereact/card';
import { PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PageContentWrapper = ({ children }: PropsWithChildren<any>) => {
  return <Card>{children}</Card>;
};
