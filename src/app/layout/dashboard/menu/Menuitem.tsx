import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './MenuItem.scss';
import { setGlobalState } from '../../../core/redux/hooks/reduxHooks';
import { mainMenuActions } from '../../../core/redux/mainMenu';

interface MenuItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any;
  root?: boolean;
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MenuItem: React.FC<MenuItemProps> = ({ item, root = false, index }) => {
  const dispatch = setGlobalState();
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const location = useLocation();

  library.add(fas);

  useEffect(() => {
    if (item.to || item.items) {
      updateActiveStateFromRoute();
    }
  }, [location]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isChildActive = (items: any[]): boolean => {
    return items.some((child) => {
      if (child.to === location.pathname) {
        return true;
      }
      if (child.items) {
        return isChildActive(child.items);
      }
      return false;
    });
  };

  const updateActiveStateFromRoute = () => {
    if (item.to && location.pathname === item.to) {
      setActive(true);
    } else if (item.items && !root && isChildActive(item.items)) {
      setActive(true);
    } else {
      setActive(false);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    // Zmiana aktywności submenu tylko w przypadku kliknięcia w elementy z submenu
    if (item.items) {
      event.preventDefault(); // Zapobiegaj domyślnemu zachowaniu linku
      setActive((prevActive) => !prevActive); // Toggle submenu
    } else {
      // Zamknięcie menu po wybraniu linku
      const mediaQuery = window.matchMedia('(max-width: 991px)');
      if (mediaQuery.matches) {
        dispatch(mainMenuActions.setMainMenuState(false));
      }
    }

    // Dla elementów z linkiem, nie blokuj przejścia do nowej ścieżki
    if (item.to) {
      return; // Przechodzimy do linku, nic więcej nie robimy
    }

    // Jeżeli element jest wyłączony, zapobiegaj domyślnemu zachowaniu
    if (item.disabled) {
      event.preventDefault();
      return;
    }
  };

  return (
    <li className={`menu-item ${root ? 'root mb-1' : ''} ${active ? 'active-menuitem' : ''}`}>
      {!item.to || item.items ? (
        <>
          {!item.to && <strong className="text-uppercase">{t(item.label)}</strong>}
          {item.to && item.items ? (
            <a href={item.url || '#'} target={item.target} onClick={handleClick}>
              {item.icon && <FontAwesomeIcon icon={['fas', ('fa-' + item.icon) as IconName]} size={'xs'} />}
              <span className="layout-menuitem-text ms-1">{t(item.label)}</span>
              {item.to && (
                <i className="pi pi-fw layout-submenu-toggler">
                  <FontAwesomeIcon icon={['fas', 'fa-angle-down' as IconName]} size={'xs'} />
                </i>
              )}
            </a>
          ) : null}
        </>
      ) : (
        <Link to={item.to} onClick={handleClick}>
          {item.icon && <FontAwesomeIcon icon={['fas', ('fa-' + item.icon) as IconName]} size="xs" />}
          <span className="layout-menuitem-text ms-1">{t(item.label)}</span>
        </Link>
      )}
      {item.items && (
        <ul className={`${active ? 'layout-submenu-enter-done' : 'layout-submenu-exit-done'}`}>
          {item.items.map((child: any, i: number) => (
            <MenuItem item={child} index={i} key={child.label} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
