import { Outlet } from 'react-router-dom';
import './ErrorLayout.scss';

export const ErrorLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};