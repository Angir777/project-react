import { Outlet } from 'react-router-dom';
import './PublicLayout.scss';

export const PublicLayout = () => {
  return (
    <div className="background">
      <div className="panel slider-thumb container-fluid d-flex justify-content-center align-items-center vh-100">
        <Outlet />
      </div>
    </div>
  );
};
