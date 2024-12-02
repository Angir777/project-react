import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { setPageTitle } from '../../../utils/page-title.utils';

const Home: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Ustawienie title strony
    setPageTitle(null);
  });

  return (
    <>
      <PageHeading title={t('home.title')} />

      <PageContentWrapper>
        <div className="row">
          <div className="col-12">
            <h1 className="m-0 mb-2 text-center display-1">{t('appName')}</h1>
          </div>
        </div>
      </PageContentWrapper>
    </>
  );
};
export default Home;
