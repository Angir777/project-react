import { FC, useEffect } from 'react';
import { setPageTitle } from '../../utils/page-title.utils';
import './ErrorPage.scss';

const Page404: FC = () => {
  useEffect(() => {
    // Ustawienie title strony
    setPageTitle('404');
  });

  return (
    <>
      <div className="error-page">
        <div className="error-text">404</div>
      </div>
    </>
  );
};
export default Page404;
