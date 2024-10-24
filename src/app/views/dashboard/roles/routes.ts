import React from 'react';
import { RouteElement } from '../../../models/auth/RouteElement';

const Home = React.lazy(() => import('./Roles'));

export const ROLES_ROUTES: RouteElement[] = [
    {
        path: '/roles',
        element: Home,
        permissions: ['USER']
    },
];
