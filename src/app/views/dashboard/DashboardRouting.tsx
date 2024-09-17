import { Navigate, Route, Routes } from 'react-router-dom';
import { RouteElement } from '../../models/auth/RouteElement';
import { RequirePermission } from '../../core/auth/RequirePermission';
import { RequireAuth } from '../../core/auth/RequireAuth';
import { DashboardLayout } from '../../layout/dashboard/DashboardLayout';
import { HOME_ROUTES } from './home/routes';
// import {ROLES_ROUTES} from "./roles/routes";
// import {USERS_ROUTES} from "./users/routes";
// import {CURRENT_USER_ROUTES} from "./current-user/routes";

const DASHBOARD_ROUTES: RouteElement[] = [...HOME_ROUTES];

const DashboardRouting = () => {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="home" />} />

          {DASHBOARD_ROUTES.map((dr) => (
            <Route 
              key={dr.path} 
              path={dr.path} 
              element={<RequirePermission 
                element={<dr.element />} 
                permissions={dr.permissions} />
              } 
            />
          ))}
        </Route>
      </Routes>
    </RequireAuth>
  );
};
export default DashboardRouting;