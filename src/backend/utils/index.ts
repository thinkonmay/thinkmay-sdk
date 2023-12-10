import { externalLink } from './constant';

const apps: {
    name: string,
    id: string,
    action: string,
    payload?: string
}[] = [
    {
        name: 'Settings',
        id: 'settings',
        action: 'apps/app_toggle',
        payload: 'settings'
    },
    {
        name: 'Get Started',
        id: 'getstarted',
        action: 'apps/app_toggle',
        payload: 'getstarted'
    },
    {
        name: 'Worker Profile',
        id: 'worker',
        action: 'WORKER'
    },
    {
        name: 'Browser',
        id: 'edge',
        action: 'apps/app_toggle',
        payload: 'edge'
    },
    {
        name: 'Store',
        id: 'store',
        action: 'apps/app_toggle',
        payload: 'store'
    },
    {
        name: 'Payment',
        id: 'payment',
        action: 'apps/app_toggle',
        payload: 'payment'
    },
    {
        name: 'Guideline',
        id: 'about',
        action: 'apps/app_toggle',
        payload: 'about'
    },
    {
        name: 'Discord',
        id: 'discord',
        action: 'apps/app_external',
        payload: externalLink.DISCORD_LINK
    },
    {
        name: 'Thinkmay Fanpage',
        id: 'facebook',
        action: 'apps/app_external',
        payload: externalLink.FACEBOOK_LINK
    }
];
var { taskbar, desktop } = {
    taskbar: ['Store'],
    desktop: [
        'Settings',
        'Get Started',
        'Worker Profile',
        'Github',
        'Browser',
        'FeedBack',
        'Landing page',
        'Discord',
        'Thinkmay Fanpage',
        'Store',
        'Payment'
    ],
};

export const taskApps = apps
    .filter((x) => taskbar.includes(x.name))
    .map(x => x.id);

export const desktopApps = apps
    .filter((x) => desktop.includes(x.name))
    .sort((a, b) => desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1)
    .map(x => x.id);

export const allApps = apps