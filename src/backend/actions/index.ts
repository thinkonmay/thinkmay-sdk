import 'sweetalert2/src/sweetalert2.scss';
import { getDomainURL, POCKETBASE } from '../../../src-tauri/api';
import '../reducers/index';
import {
    appDispatch,
    close_remote,
    fetch_user,
    personal_worker_session_close,
    setting_theme,
    sidepane_panethem,
    store,
    user_update,
    wall_set
} from '../reducers/index';
import { keyboardCallback } from '../reducers/remote';

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

export const login = async (
    provider: 'google' | 'facebook' | 'discord' | 'password'
) => {
    const collection = POCKETBASE.collection('users');

    const {
        record: { id }
    } =
        provider == 'password'
            ? await collection.authWithPassword(
                  prompt('Enter your username'),
                  prompt('Enter your password')
              )
            : await collection.authWithOAuth2({
                  provider,
                  urlCallback: (url) => {
                      window.open().location.href = url;
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

export const afterMath = (event: any) => {
    var ess = [
        ['BAND', 'sidepane/sidepane_bandhide', 'sidepane.banhide'],
        ['PANE', 'sidepane/sidepane_panehide', 'sidepane.hide']
    ];

    var actionType = '';
    try {
        actionType = event.target.dataset.action || '';
    } catch (err) {}

    var actionType0 = getComputedStyle(event.target).getPropertyValue(
        '--prefix'
    );

    const data = store.getState();
    ess.forEach((item) => {
        if (
            !actionType.startsWith(item[0]) &&
            !actionType0.startsWith(item[0]) &&
            !getTreeValue(data, item[2])
        )
            appDispatch({ type: item[1], payload: {} });
    });
};
