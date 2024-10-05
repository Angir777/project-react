import { Outlet } from 'react-router-dom';
import Header from './header/Header';

export const DashboardLayout = () => {
  return (
    <div className="layout-wrapper layout-static p-ripple-disabled">
      <Header />

      <div>
        {/* Sidebar */}
      </div>
      <div>
        <Outlet />
      </div>

      {/* Footer */}
    </div>
  );
};