import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Sidebar from './sidebar/Sidebar';
import { RootState } from '../../core/redux';
import { getGlobalState, setGlobalState } from '../../core/redux/hooks/reduxHooks';
import { useEffect } from 'react';
import { mainMenuActions } from '../../core/redux/mainMenu';

export const DashboardLayout = () => {
  const dispatch = setGlobalState();
  const currentMenuState = getGlobalState((state: RootState) => state.mainMenu.currentMainMenu);

  useEffect(() => {
    dispatch(mainMenuActions.getMainMenuState());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const mainMenu = document.getElementById('main-menu-icon');
      const mediaQuery = window.matchMedia('(max-width: 991px)');

      // Sprawdzenie, czy kliknięto poza elementem wywołującym boczne menu
      if (!mainMenu?.contains(event.target as Node) && mediaQuery.matches) {
        dispatch(mainMenuActions.setMainMenuState(false));
      }
    };

    // Dodanie event listenera
    document.addEventListener('click', handleClickOutside);

    // Usunięcie event listenera przy odmontowaniu
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dispatch]);

  return (
    <div
      className={`layout-wrapper layout-static p-ripple-disabled ${!currentMenuState ? 'layout-static-inactive' : ''} ${currentMenuState ? 'layout-mobile-active' : ''}`}>
      <Header />
      <div className="layout-sidebar">
        {/* TODO: Menu do wygenerowania */}
        <Sidebar />
      </div>
      <div className="layout-main-container">
        <div className="layout-main">
          {/* TODO: Widok ról i użytkowników */}
          <Outlet />
        </div>
        {/* TODO: Footer */}
      </div>
    </div>
  );
};
