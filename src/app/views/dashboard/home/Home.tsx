import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { setPageTitle } from '../../../utils/page-title.utils';

const Home: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    setPageTitle(null); // TODO: Do sprawdzenia czy to potrzebne
  });

  return (
    <>
    {/* TODO: PageHeading do sprawdzenia czy potrzebne */}
      <PageHeading title="Home" />

      {/* TODO: PageContentWrapper do sprawdzenia czy potrzebne */}
      <PageContentWrapper>
        <div className="">
          <div className="mx-auto">
            <main className="mx-auto w-full px-4 sm:mt-12 sm:px-6 mt-10 lg:mt-8 lg:px-8 pb-10 md:pb-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-3">
                  <span className="block text-indigo-600 xl:inline">{t('appName')}</span>
                </h1>
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
                  <span className="block xl:inline">{t('aboutApp.title')}</span>
                </h3>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 md:mt-5 md:text-base lg:mx-0">{t('aboutApp.description')}</p>
              </div>
            </main>
          </div>
        </div>
      </PageContentWrapper>
    </>
  );
};
export default Home;
