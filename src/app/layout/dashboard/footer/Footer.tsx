import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../core/redux';

const Footer: FC = () => {
  const { t } = useTranslation();

  // Pobranie aktualnego motywu
  const currentMotyw = useSelector((state: RootState) => state.motyw.currentMotyw);

  return (
    <div className="layout-footer">
      <img src={`/images/logo-${currentMotyw !== 'light' ? 'white' : 'dark'}.svg`} alt="Logo" height="20" className="mr-2" />
      {t('appName')} by
      <span className="font-medium ms-2">PrimeReact</span>
    </div>
  );
};

export default Footer;
