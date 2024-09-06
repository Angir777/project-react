import { Outlet } from 'react-router-dom';
import './DashboardLayout.scss';

export const DashboardLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};