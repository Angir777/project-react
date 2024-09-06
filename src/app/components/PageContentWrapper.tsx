import { PropsWithChildren } from 'react';

export const PageContentWrapper = ({ children }: PropsWithChildren<any>) => {
  return (
    <div className="pb-4">
      <div className="w-full sm:px-6 lg:px-8">
        <div className="bg-white overflow-auto shadow-sm sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};
