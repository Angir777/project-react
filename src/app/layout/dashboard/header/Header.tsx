import { classNames } from 'primereact/utils';
import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tooltip } from 'primereact/tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCircleHalfStroke, faGear, faArrowRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { authActions } from '../../../core/redux/auth';
import LanguageDropdown from '../../../components/LanguageDropdown';
import './Header.scss';
import { RootState } from '../../../core/redux';
import { motywActions } from '../../../core/redux/motyw';
import { useSelector } from 'react-redux';

const Header: FC = () => {
  const dispatch = setGlobalState();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Pokazywanie i chowane menu
  const [isOpenHeaderMenu, setIsOpenHeaderMenu] = useState(false);
  // Dodanie nasłuchiwania kliknięć poza menu by automatycznie schować menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const headerMenu = document.getElementById('header-menu-icon');
      const languageDropdown = document.getElementById('language-dropdown');

      // Sprawdzenie, czy kliknięto poza elementami menu i selectu
      if (isOpenHeaderMenu && !headerMenu?.contains(event.target as Node) && !languageDropdown?.contains(event.target as Node)) {
        setIsOpenHeaderMenu(false);
      }
    };

    // Dodanie event listenera
    document.addEventListener('click', handleClickOutside);

    // Usunięcie event listenera przy odmontowaniu
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpenHeaderMenu]);

  // Pobranie aktualnego motywu
  const currentMotyw = useSelector((state: RootState) => state.motyw.currentMotyw);

  // Zmiana motywu
  const changeMotyw = () => {
    const newMotyw = currentMotyw == 'light' ? 'dark' : 'light'; // Sprawdzenie aktualnego motywu
    dispatch(motywActions.changeMotyw(newMotyw)); // Zmieniamy motyw na nowy
  };

  // Wylogowywanie
  const logout = () => {
    dispatch(authActions.logout());
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout-topbar">
      {/* Logo */}
      <Link to="/" className="layout-topbar-logo">
        <img src={`/images/logo-${currentMotyw !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
        <span>SAKAI</span>
      </Link>

      {/* Ikona menu w sidebar */}
      <button type="button" className="p-link layout-menu-button layout-topbar-button">
        <i className="pi pi-bars" />
        <FontAwesomeIcon icon={faBars} />
      </button>

      {/* Ikona menu w header */}
      <button
        id="header-menu-icon"
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={() => setIsOpenHeaderMenu(!isOpenHeaderMenu)}>
        <FontAwesomeIcon icon={faUser} />
      </button>

      <div className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': isOpenHeaderMenu })}>
        {/* Język */}
        <div id="language-dropdown">
          <LanguageDropdown />
        </div>

        {/* Motyw */}
        <button id="motyw" type="button" className="p-link layout-topbar-button" onClick={changeMotyw}>
          <FontAwesomeIcon icon={faCircleHalfStroke} />
          <span className="ms-2">{t('navHeader.motyw')}</span>
        </button>
        <Tooltip target="#motyw" content={t('navHeader.motyw')} position="bottom" />

        {/* Ustawienia */}
        <Link to="/dashboard/settings">
          <button id="settings" type="button" className="p-link layout-topbar-button">
            <FontAwesomeIcon icon={faGear} />
            <span className="ms-2">{t('navHeader.settings')}</span>
          </button>
          <Tooltip target="#settings" content={t('navHeader.settings')} position="bottom" />
        </Link>

        {/* Wyloguj */}
        <button id="logout" type="button" className="p-link layout-topbar-button" onClick={logout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span className="ms-2">{t('navHeader.logout')}</span>
        </button>
        <Tooltip target="#logout" content={t('navHeader.logout')} position="bottom" />
      </div>
    </div>
  );
};

export default Header;
