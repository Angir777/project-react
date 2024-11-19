import React from 'react';
import { RouteElement } from '../../../models/auth/RouteElement';

const RolesList = React.lazy(() => import('./RolesList'));
const UpdateRole = React.lazy(() => import('./UpdateRole'));

export const ROLES_ROUTES: RouteElement[] = [
    {
        path: '/roles',
        element: RolesList,
        permissions: ['ROLE_MANAGE', 'ROLE_ACCESS']
    },
    {
        path: '/roles/new',
        element: UpdateRole,
        permissions: ['ROLE_MANAGE']
    },
    {
        path: '/roles/:id/edit',
        element: UpdateRole,
        permissions: ['ROLE_MANAGE']
    }
];
