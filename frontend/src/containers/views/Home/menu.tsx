import React from 'react'
import Loadable from '@loadable/component'

import PageLoading from '@components/PageLoading'

const loadComponent = (loader: () => Promise<any>) => Loadable(loader, { fallback: <PageLoading /> })

export const asynchronousComponents = {
    Sites: loadComponent(() => import(/* webpackChunkName:"sites"  */ '@views/Sites')),
    Users: loadComponent(() => import(/* webpackChunkName: "users" */ '@views/Users')),
    Settings: loadComponent(() => import(/* webpackChunkName: "settings" */ '@views/Settings')),
    Metrics: loadComponent(() => import(/* webpackChunkName: "metrics" */ '@views/Metrics')),
    Tasks: loadComponent(() => import(/* webpackChunkName: "tasks" */ '@views/Tasks')),
    Filters: loadComponent(() => import(/* webpackChunkName: "filters" */ '@views/Filters')),
    Actions: loadComponent(() => import(/* webpackChunkName: "actions" */ '@views/Actions'))
}

// all routers key
export type AsynchronousComponentKeys = keyof typeof asynchronousComponents

export interface IMenu {
    title: string
    id: number
    pid?: number
    path?: string
    icon?: string
    component?: AsynchronousComponentKeys
    exact?: boolean
}

export interface IMenuInTree extends IMenu {
    children?: IMenuInTree[]
}

export const menu: IMenu[] = [
    {
        id: 1,
        path: '/',
        title: 'Sites',
        icon: 'global',
        component: 'Sites',
        exact: true
    },
    {
        id: 2,
        path: '/users',
        title: 'Users',
        icon: 'user',
        component: 'Users',
        exact: true
    },
    {
        id: 3,
        path: '/filters',
        title: 'Filters',
        icon: 'filter',
        component: 'Filters',
        exact: true
    },
    {
        id: 4,
        path: '/actions',
        title: 'Actions',
        icon: 'tool',
        component: 'Actions',
        exact: true
    },
    {
        id: 5,
        path: '/tasks',
        title: 'Tasks',
        icon: 'hourglass',
        component: 'Tasks',
        exact: true
    },
    {
        id: 6,
        path: '/metrics',
        title: 'Metrics',
        icon: 'project',
        component: 'Metrics',
        exact: true
    },
    {
        id: 7,
        path: '/settings',
        title: 'Settings',
        icon: 'setting',
        component: 'Settings',
        exact: true
    }

]

export default menu
