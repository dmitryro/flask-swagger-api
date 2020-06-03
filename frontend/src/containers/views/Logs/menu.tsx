import React from 'react'
import Loadable from '@loadable/component'

import PageLoading from '@components/PageLoading'

const loadComponent = (loader: () => Promise<any>) => Loadable(loader, { fallback: <PageLoading /> })

export const asynchronousComponents = {
    Sites: loadComponent(() => import(/* webpackChunkName:"sites"  */ '@views/Sites')),
    Users: loadComponent(() => import(/* webpackChunkName: "users" */ '@views/Users')),
    Settings: loadComponent(() => import(/* webpackChunkName: "settings" */ '@views/Settings')),
    Analytics: loadComponent(() => import(/* webpackChunkName: "metrics" */'@views/Analytics')),
    Chains: loadComponent(() => import(/* webpackChunkName: "tasks" */'@views/Chains')),
    Rules: loadComponent(() => import(/* webpackChunkName: "filters" */'@views/Rules')),
    Events: loadComponent(() => import(/* webpackChunkName: "filters" */'@views/Events')),
    Contacts: loadComponent(() => import(/* webpackChunkName: "filters" */'@views/Contacts')),
    Actions: loadComponent(() => import(/* webpackChunkName: "actions" */ '@views/Actions'))
    Logs: loadComponent(() => import(/* webpackChunkName: "logs" */ '@views/Logs'))
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
        path: '/actions',
        title: 'Actions',
        icon: 'tool',
        component: 'Actions',
        exact: true
    },
    {
        id: 4,
        path: '/chains',
        title: 'Chains',
        icon: 'filter',
        component: 'Chains',
        exact: true
    },
    {
        id: 5,
        path: '/rules',
        title: 'Rules',
        icon: 'tool',
        component: 'Rules',
        exact: true
    },
    {
        id: 6,
        path: '/events',
        title: 'Events',
        icon: 'hourglass',
        component: 'Events',
        exact: true
    },
    {
        id: 7,
        path: '/analytics',
        title: 'Analytics',
        icon: 'project',
        component: 'Analytics',
        exact: true
    },
    {
        id: 8,
        path: '/contacts',
        title: 'Contacts',
        icon: 'tool',
        component: 'Contacts',
        exact: true
    },
    {
        id: 9,
        path: '/settings',
        title: 'Settings',
        icon: 'setting',
        component: 'Settings',
        exact: true
    },
    {
        id: 10,
        path: '/logs',
        title: 'Logs',
        icon: 'BarsOutlined',
        component: 'Logs',
        exact: true
    }
]

export default menu
