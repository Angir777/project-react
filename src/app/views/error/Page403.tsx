import { FC, useEffect } from 'react';
import { setPageTitle } from '../../utils/page-title.utils';
import './ErrorPage.scss';

const Page403: FC = () => {
  useEffect(() => {
    // Ustawienie title strony
    setPageTitle('403');
  });

  return (
    <>
      <div className="error-page">
        <div className="error-text">403</div>
      </div>
    </>
  );
};
export default Page403;
