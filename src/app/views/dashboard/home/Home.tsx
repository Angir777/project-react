import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { setPageTitle } from '../../../utils/page-title.utils';
import { getGlobalState } from '../../../core/redux/hooks/reduxHooks';

const Home: FC = () => {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUser = getGlobalState((state: { auth: { currentUser: any } }) => state.auth.currentUser);

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
            <h6 className="m-0">{t('home.hello')} {currentUser.name}!</h6>
          </div>
        </div>
      </PageContentWrapper>
    </>
  );
};
export default Home;
