import React from 'react';
import { RouteElement } from '../../../models/auth/RouteElement';

const Settings = React.lazy(() => import('./Settings'));

export const SETTINGS_ROUTES: RouteElement[] = [
    {
        path: '/settings',
        element: Settings,
        permissions: ['USER']
    },
];
