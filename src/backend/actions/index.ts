import 'sweetalert2/src/sweetalert2.scss';
import { getDomainURL, POCKETBASE } from '../../../src-tauri/api';
import '../reducers/index';
import {
    appDispatch,
    close_remote,
    desk_hide,
    desk_show,
    fetch_user,
    personal_worker_session_close,
    setting_theme,
    sidepane_panethem,
    store,
    user_update,
    wall_set
} from '../reducers/index';
import { keyboardCallback } from '../reducers/remote';
import { fetchApp } from './background';

export const refresh = async () => {
    appDispatch(desk_hide());
    await fetchApp();
    setTimeout(() => appDispatch(desk_show()), 200);
};


export const getTreeValue = (obj: any, path: any) => {
    if (path == null) return false;

    var tdir = { ...obj };
    path = path.split('.');
    for (var i = 0; i < path.length; i++) {
        tdir = tdir[path[i]];
    }

    return tdir;
};

export const changeTheme = () => {
    var thm = store.getState().setting.person.theme,
        thm = thm == 'light' ? 'dark' : 'light';
    var icon = thm == 'light' ? 'sun' : 'moon';
    localStorage.setItem('theme', thm);
    document.body.dataset.theme = thm;
    appDispatch(setting_theme(thm));
    appDispatch(sidepane_panethem(icon));
    appDispatch(wall_set(thm == 'light' ? 0 : 1));
};

export const dispatchOutSide = (action: string, payload: any) => {
    appDispatch({ type: action, payload });
};

export const loginWithEmail = async (email: string, password: string) => {};

export const signUpWithEmail = async (email: string, password: string) => {};
export const login = async (provider: 'google' | 'facebook' | 'discord') => {
    let w = window.open();

    const {
        record: { id }
    } = await POCKETBASE.collection('users').authWithOAuth2({
        provider: 'google',
        urlCallback: (url) => {
            w.location.href = url;
        }
    });
    const record = await POCKETBASE.collection('users').getOne(id);
    appDispatch(user_update(record));
    await appDispatch(fetch_user());
};

export const shutDownVm = async () => {
    await appDispatch(personal_worker_session_close());
    appDispatch(close_remote());
};
export const clickShortCut = (keys = []) => {
    keys.forEach((k, i) => {
        keyboardCallback(k, 'down');
    });
    keys.forEach((k, i) => {
        keyboardCallback(k, 'up');
    });
};

export const bindStoreId = async (email: string, store_id: number) => {
    try {
        const data = await fetch(`${getDomainURL()}/access_store_volume`, {
            method: 'POST',
            headers: {
                Authorization: POCKETBASE.authStore.token
            },
            body: JSON.stringify({
                store_id,
                email
            })
        });
        if (data.ok === false) throw await data.text();

        return data;
    } catch (error) {
        throw error;
    }
};
