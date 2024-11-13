import React from 'react';
import { RouteElement } from '../../../models/auth/RouteElement';

const UsersList = React.lazy(() => import('./UsersList'));
const DeleteUsersList = React.lazy(() => import('./DeleteUsersList'));
const UpdateUser = React.lazy(() => import('./UpdateUser'));

export const USERS_ROUTES: RouteElement[] = [
    {
        path: '/users',
        element: UsersList,
        permissions: ['USER_MANAGE', 'USER_ACCESS']
    },
    {
        path: '/users/deleted',
        element: DeleteUsersList,
        permissions: ['USER_MANAGE', 'USER_ACCESS']
    },
    {
        path: '/users/new',
        element: UpdateUser,
        permissions: ['USER_MANAGE']
    },
    {
        path: '/users/:id/edit',
        element: UpdateUser,
        permissions: ['USER_MANAGE']
    }
];
