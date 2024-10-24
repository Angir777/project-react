import React from 'react';
import { RouteElement } from '../../../models/auth/RouteElement';

const Home = React.lazy(() => import('./Users'));

export const USERS_ROUTES: RouteElement[] = [
    {
        path: '/users',
        element: Home,
        permissions: ['USER']
    },
];
