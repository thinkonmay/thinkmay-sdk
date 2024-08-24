import 'sweetalert2/src/sweetalert2.scss';
import {
    pb,
    supabase,
    SupabaseFuncInvoke
} from '../reducers/fetch/createClient';
import { Computer, StartRequest } from '../reducers/fetch/local';
import '../reducers/index';
import {
    appDispatch,
    desk_hide,
    desk_show,
    desk_size,
    desk_sort,
    dispatch_generic,
    fetch_user,
    menu_chng,
    menu_hide,
    popup_close,
    popup_open,
    setting_theme,
    sidepane_panethem,
    store,
    toggle_remote,
    user_update,
    wall_set,
    worker_session_close
} from '../reducers/index';
import { keyboardCallback } from '../reducers/remote';
import { localStorageKey, pathNames, PlanName } from '../utils/constant';
import { RenderNode } from '../utils/tree';
import { fetchApp } from './background';

export const refresh = async () => {
    appDispatch(desk_hide());
    await fetchApp();
    setTimeout(() => appDispatch(desk_show()), 200);
};

export const afterMath = (event: any) => {
    var ess = [
        ['START', 'startmenu/starthid', 'startmenu.hide'], // TODO
        ['BAND', 'sidepane/sidepane_bandhide', 'sidepane.banhide'],
        ['PANE', 'sidepane/sidepane_panehide', 'sidepane.hide'],
        ['MENU', 'menu/menu_hide', 'menus.hide']
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
export const changeIconSize = (size: string, menu: any) => {
    var tmpMenu = { ...menu };
    tmpMenu.menus.desk[0].opts[0].dot = false;
    tmpMenu.menus.desk[0].opts[1].dot = false;
    tmpMenu.menus.desk[0].opts[2].dot = false;
    var isize = 1;

    if (size == 'large') {
        tmpMenu.menus.desk[0].opts[0].dot = true;
        isize = 1.5;
    } else if (size == 'medium') {
        tmpMenu.menus.desk[0].opts[1].dot = true;
        isize = 1.2;
    } else {
        tmpMenu.menus.desk[0].opts[2].dot = true;
    }

    // refresh("", tmpMenu);
    appDispatch(desk_size(isize));
    appDispatch(menu_chng({}));
};

export const changeSort = (sort: string, menu: any) => {
    var tmpMenu = { ...menu };
    tmpMenu.menus.desk[1].opts[0].dot = false;
    tmpMenu.menus.desk[1].opts[1].dot = false;
    tmpMenu.menus.desk[1].opts[2].dot = false;
    if (sort == 'name') {
        tmpMenu.menus.desk[1].opts[0].dot = true;
    } else if (sort == 'size') {
        tmpMenu.menus.desk[1].opts[1].dot = true;
    } else {
        tmpMenu.menus.desk[1].opts[2].dot = true;
    }

    appDispatch(desk_sort(sort));
    appDispatch(menu_chng(tmpMenu));
};

export const changeTaskAlign = (align: string, menu: any) => {
    var tmpMenu = { ...menu };
    if (tmpMenu.menus.task[0].opts[align == 'left' ? 0 : 1].dot) return;

    tmpMenu.menus.task[0].opts[0].dot = false;
    tmpMenu.menus.task[0].opts[1].dot = false;

    if (align == 'left') {
        tmpMenu.menus.task[0].opts[0].dot = true;
    } else {
        tmpMenu.menus.task[0].opts[1].dot = true;
    }

    appDispatch({ type: 'TASKTOG', payload: {} });
    appDispatch({ type: 'MENUCHNG', payload: tmpMenu });
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

export const menuDispatch = async (event: Event) => {
    const dataset = (event.target as any)?.dataset as {
        action: string;
        payload: any;
    };
    if (dataset.action == undefined) return;

    appDispatch(menu_hide());

    dispatch_generic({
        type: dataset.action,
        payload: store.getState().menus.dataset?.payload
    });
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
    } = await pb.collection('users').authWithOAuth2({
        provider: 'google',
        urlCallback: (url) => {
            w.location.href = url;
        }
    });
    const record = await pb.collection('users').getOne(id);
    appDispatch(user_update(record));
    await appDispatch(fetch_user());
};

export const getHostSessionIdByEmail = async (): Promise<string> => {
    const all = await pb.collection('volumes').getFullList<{
        local_id: string;
    }>();

    const volume_id = all.at(0)?.local_id;

    const node = new RenderNode(store.getState().worker.data);

    let volumeFound: RenderNode<Computer> | undefined = undefined;

    node.iterate((x) => {
        if (
            volumeFound == undefined &&
            (x.info as Computer)?.Volumes?.includes(volume_id)
        )
            volumeFound = x;
    });

    const host_session = node.findParent(volumeFound.id, 'host_session');
    return host_session.id ?? '';
};

export const getVolumeIdByEmail = async (): Promise<string> => {
    const all = await pb.collection('volumes').getFullList<{
        local_id: string;
    }>();

    return all.at(0)?.local_id ?? '';
};

export const getEmailFromDB = async (): Promise<string> => {
    const all = await pb.collection('users').getFullList<{
        email: string;
    }>();

    return all.at(0)?.email ?? '';
};
export const shutDownVm = async () => {
    // get volume id
    const host_session_id = await getHostSessionIdByEmail();
    // call worker_ss_close
    await appDispatch(worker_session_close(host_session_id));

    appDispatch(toggle_remote());
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
        const data = await fetch(
            'https://play.thinkmay.net/access_store_volume',
            {
                method: 'POST',
                headers: {
                    Authorization: pb.authStore.token
                },
                body: JSON.stringify({
                    store_id,
                    email
                })
            }
        );
        if (data.ok === false) throw await data.text();

        return data;
    } catch (error) {
        throw error;
    }
};

export const isAlowBuyHourSub = async () => {
    try {
        const { data, error } = await supabase.rpc('allow_hour_plan');

        if (data.ok === false) {
            console.log(error);
        }

        return data;
    } catch (error) {
        console.log(error);
    }
};
interface PaymentBody {
    buyerEmail: string;
    items: {
        name: PlanName;
        price: number;
        quantity: number;
    }[];
}

export const createPaymentLink = async (inputs: PaymentBody) => {
    const result = await SupabaseFuncInvoke('create_payment_link', inputs);
    if (result instanceof Error) throw result;

    return result;
};

interface VerifyPaymentBody {
    email: string;
}

export const verifyPayment = async (inputs: VerifyPaymentBody) => {
    const oldPathName = localStorage.getItem(localStorageKey.PATH_NAME);
    localStorage.removeItem(localStorageKey.PATH_NAME);
    if (oldPathName != pathNames.VERIFY_PAYMENT || !inputs) {
        return;
    }

    const result = await SupabaseFuncInvoke('verify_payment', {
        email: inputs
    });

    if (result instanceof Error) throw result;

    await appDispatch(fetch_user());
    return result;
};

export const wrapperAsyncFunction = async (
    fun: () => Promise<void>,
    { loading = true, title = 'Loading...', text, tips = true, timeProcessing }
) => {
    try {
        appDispatch(
            popup_open({
                type: 'notify',
                data: {
                    loading,
                    title,
                    text,
                    tips,
                    timeProcessing
                }
            })
        );
        const data = await fun();
        appDispatch(popup_close());
        return data;
    } catch (error) {
        appDispatch(popup_close());
        appDispatch(
            popup_open({
                type: 'complete',
                data: {
                    success: false,
                    content: error.message
                }
            })
        );
    } finally {
    }
};

//Connecting to old session

export const hasHourSession = async () => {
    const all = await pb.collection('volumes').getFullList();
    const foundVolumeId = all.at(0)?.local_id;

    const node = new RenderNode(store.getState().worker.data);
    let result: RenderNode<Computer> | undefined = undefined;
    node.iterate((x) => {
        if (
            result == undefined &&
            (x.info as Computer)?.Volumes?.includes(foundVolumeId)
        )
            result = x;
    });
    const session = node.find<StartRequest>(result?.data?.at(0)?.id)?.info;
    const vm_session_id = node.findParent<StartRequest>(
        result?.data?.at(0)?.id,
        'host_session'
    )?.info.id;

    return session?.id;
};

// connect to session
