import React from 'react';
import { RouteElement } from '../../../models/auth/RouteElement';

const Home = React.lazy(() => import('./Home'));

export const HOME_ROUTES: RouteElement[] = [
    {
        path: '/home',
        element: Home,
        permissions: ['GENERAL_ACCESS']
    },
];
