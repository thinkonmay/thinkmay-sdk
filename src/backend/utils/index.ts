import { MenuOption } from '../reducers/menu';

export type AppData = {
    id: string;
    name: string;
    action: string;
    payload?: any;

    menu?: MenuOption;
    size?: string;
    ready?: boolean;
    installing?: boolean;
    hide?: boolean;
    max?: boolean | null;
    z?: number;
    dim?: any;
    url?: string | null;
};

const apps: AppData[] = [
    {
        name: 'Máy tính cá nhân',
        id: 'connectPc',
        action: 'apps/app_toggle',
        payload: 'connectPc',
        max: false,
        size: 'mini'
    },
];
var { taskbar, desktop } = {
    taskbar: [],
    desktop: [ 'Máy tính cá nhân', ]
};

apps.map((x) => {
    x.size = 'full';
    x.hide = false;
    x.max = x.max ?? null;
    x.z = 0;
});

export const taskApps = apps
    .filter((x) => taskbar.includes(x.name))
    .map((x) => x.id);

export const desktopApps = apps
    .filter((x) => desktop.includes(x.name))
    .sort((a, b) =>
        desktop.indexOf(a.name) > desktop.indexOf(b.name) ? 1 : -1
    )
    .map((x) => x.id);

export const allApps = apps;
