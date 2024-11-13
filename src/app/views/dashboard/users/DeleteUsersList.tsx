import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContentWrapper, PageHeading } from '../../../components';
import { setPageTitle } from '../../../utils/page-title.utils';

const DeleteUsersList: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // Ustawienie title strony
    setPageTitle(t('users.title'));
  });

  return (
    <>
      <PageHeading title={t('users.title')} />

      <PageContentWrapper>
        <div className="row">
          <div className="col-12">
          DeleteUsersList
          </div>
        </div>
      </PageContentWrapper>
    </>
  );
};
export default DeleteUsersList;
