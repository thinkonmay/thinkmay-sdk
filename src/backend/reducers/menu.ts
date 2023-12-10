const initialState = {
    hide: true,
    top: 80,
    left: 360,
    opts: 'desk',
    attr: {},
    dataset: {},
    data: {
        desk: {
            width: '310px',
            secwid: '200px'
        },
        task: {
            width: '220px',
            secwid: '120px',
            ispace: false // show the space for icons in menu
        },
        application: {
            width: '310px',
            secwid: '200px'
        },
        externalApp: {
            width: '190px',
            secwid: '200px'
        },

        holder: {
            width: '150px',
            secwid: '100px'
        },

        subscriptions: {
            width: '180px',
            secwid: '100px'
        },
        subscription: {
            width: '180px',
            secwid: '100px'
        },

        proxy: {
            width: '150px',
            secwid: '100px'
        },
        worker: {
            width: '150px',
            secwid: '100px'
        },
        worker_session: {
            width: '150px',
            secwid: '100px'
        },
        user_session: {
            width: '150px',
            secwid: '100px'
        },

        cluster: {
            width: '150px',
            secwid: '100px'
        },
        volume: {
            width: '150px',
            secwid: '100px'
        },
        storage: {
            width: '150px',
            secwid: '100px'
        },
        app: {
            width: '150px',
            secwid: '100px'
        }
    },
    menus: {
        desk: [
            {
                name: 'View',
                icon: 'view',
                type: 'svg',
                opts: [
                    {
                        name: 'Large icons',
                        action: 'changeIconSize',
                        payload: 'large'
                    },
                    {
                        name: 'Medium icons',
                        action: 'changeIconSize',
                        payload: 'medium'
                    },
                    {
                        name: 'Small icons',
                        action: 'changeIconSize',
                        payload: 'small',
                        dot: true
                    }
                ]
            },
            {
                name: 'Sort by',
                icon: 'sort',
                type: 'svg',
                opts: [
                    {
                        name: 'Name',
                        action: 'changeSort',
                        payload: 'name'
                    },
                    {
                        name: 'Size',
                        action: 'changeSort',
                        payload: 'size'
                    },
                    {
                        name: 'Date modified',
                        action: 'changeSort',
                        payload: 'date'
                    }
                ]
            },
            {
                name: 'Refresh',
                action: 'fetch_app',
                type: 'svg',
                icon: 'refresh'
            },
            {
                type: 'hr'
            },
            {
                name: 'New',
                icon: 'New',
                type: 'svg',
                opts: [
                    {
                        name: 'Folder'
                    },
                    {
                        name: 'Shortcut'
                    },
                    {
                        name: 'Text Document'
                    },
                    {
                        name: 'Compressed (zipped) Folder'
                    }
                ]
            },
            {
                type: 'hr'
            },
            {
                name: 'Display settings',
                icon: 'display',
                type: 'svg',
                action: 'SETTINGS',
                payload: 'full'
            },
            {
                name: 'Personalize',
                icon: 'personalize',
                type: 'svg',
                action: 'SETTINGS',
                payload: 'full'
            },
            {
                type: 'hr'
            },
            {
                name: 'Next desktop background',
                action: 'WALLNEXT'
            },
            {
                name: 'Fullscreen',
                action: 'OPENTERM',
                payload: 'C:\\Users\\Blue\\Desktop'
            },
            {
                name: 'Guideline',
                action: 'ABOUT',
                icon: 'about'
            }
        ],
        task: [
            {
                name: 'Align icons',
                opts: [
                    {
                        name: 'Left',
                        action: 'changeTaskAlign',
                        payload: 'left'
                    },
                    {
                        name: 'Center',
                        action: 'changeTaskAlign',
                        payload: 'center',
                        dot: true
                    }
                ]
            },
            {
                type: 'hr'
            },
            {
                name: 'Show Desktop',
                action: 'SHOWDSK'
            }
        ],
        app: [
            {
                name: 'Open',
                action: 'performApp',
                payload: 'open'
            },
            {
                name: 'Properties',
                dsb: true
            },
            {
                type: 'hr'
            },
            {
                name: 'Delete shortcut',
                action: 'performApp',
                payload: 'delshort'
            },
            {
                name: 'Delete',
                action: 'delApp',
                payload: 'delete'
            }
        ],
        holder: [],
        externalApp: [
            {
                name: 'Open',
                action: 'OPEN_APP'
            },
            {
                name: 'Open in new tab',
                action: 'OPEN_APP_NEWTAB',
                icon: 'newTab'
            },
            {
                name: 'Reset App',
                action: 'RESET_APP',
                icon: 'reset'
            },
            {
                name: 'Start App',
                action: 'START_APP',
                icon: 'start'
            },
            {
                name: 'Pause App',
                action: 'PAUSE_APP',
                icon: 'shutdown'
            },
            {
                type: 'hr'
            },
            {
                name: 'Delete',
                action: 'delApp',
                icon: 'delete',
                payload: 'delete'
            }
        ],

        subscriptions: [
            {
                name: 'New Subscription',
                action: 'CREATE_SUB',
                payload: 'open'
            },
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'openmodal'
            }
        ],
        subscription: [
            {
                name: 'Modify',
                action: 'MODIFY_SUB',
                payload: 'open'
            },
            {
                name: 'Ajdust',
                action: 'ADJUST_SUB',
                payload: 'open'
            }
        ],

        proxy: [
            {
                name: 'Open',
                action: 'FILEDIRWORKER',
                payload: 'open'
            },
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'openmodal'
            }
        ],
        worker: [
            {
                name: 'Open',
                action: 'FILEDIRWORKER',
                payload: 'open'
            },
            {
                name: 'Connect',
                action: 'CONNECTWORKER',
                payload: 'connect'
            },
            {
                name: 'Create Session',
                action: 'CREATESESSION',
                payload: 'connect'
            },
            {
                name: 'Detail Info',
                action: 'VIEW_DETAIL',
                payload: 'openmodal'
            }
        ],
        worker_session: [
            {
                name: 'Open',
                action: 'FILEDIRWORKER'
            },
            {
                name: 'Connect',
                action: 'CONNECTWORKERSESSION',
                payload: 'connect'
            },
            {
                name: 'Deactivate Session',
                action: 'DEACTIVATESESSION',
                payload: 'connect'
            },
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'detail'
            }
        ],
        user_session: [
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'detail'
            }
        ],

        cluster: [
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'detail'
            }
        ],
        application: [
            {
                name: 'Release App',
                action: 'RELEASE_APP',
                payload: 'open'
            },
            {
                name: 'Patch App',
                action: 'PATCH_APP',
                payload: 'patch'
            },
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'detail'
            }
        ],
        storage: [
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'detail'
            },
            {
                name: 'Connect',
                action: 'CONNECT_STORAGE',
                payload: 'connect'
            },
            {
                name: 'Stop',
                action: 'STOP_STORAGE',
                payload: 'stop'
            },
            {
                name: 'Delete',
                action: 'DELETE_STORAGE',
                payload: 'delete'
            }
        ],
        volume: [
            {
                name: 'Detail',
                action: 'VIEW_DETAIL',
                payload: 'detail'
            },
            {
                name: 'Connect',
                action: 'CONNECT_VOLUME',
                payload: 'connect'
            },
            {
                name: 'Stop',
                action: 'STOP_VOLUME',
                payload: 'stop'
            },
            {
                name: 'Fork',
                action: 'FORK_VOLUME',
                payload: 'fork'
            },
            {
                name: 'Migrate',
                action: 'MIGRATE_VOLUME',
                payload: 'fork'
            },
            {
                name: 'Set default os',
                action: 'SET_DEFAULT_OS',
                payload: 'default'
            },
            {
                name: 'Delete',
                action: 'DELETE_VOLUME',
                payload: 'delete'
            }
        ]
    }
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
export const menusSlice = createSlice({
    name: 'menu',
    initialState,
    reducers: {
        menu_hide: (state, action: PayloadAction<any>) => {
            state.hide = true;
        },
        menu_show: (state, action: PayloadAction<any>) => {
            state.hide = false;
            state.top =     action.payload.top || 272;
            state.left =    action.payload.left || 430;
            state.opts =    action.payload.menu || 'desk';
            state.dataset = action.payload.dataset;
        },
        menu_chng: (state, action: PayloadAction<any>) => {
            state = { ...action.payload };
        }
    }
});