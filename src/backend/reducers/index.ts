import { ThunkMiddleware, configureStore } from '@reduxjs/toolkit';
import * as actions from '.';
import * as Actions from '../actions/index.js';
import { globalSlice } from './globals';
import { modalSlice as popupSlice } from './modal';
import { remoteAsync, remoteSlice } from './remote.js';
import { settSlice } from './settings.js';
import { sidepaneAsync, sidepaneSlice } from './sidepane';
import { userAsync, userSlice } from './user';
import { wallSlice } from './wallpaper';
import { workerAsync, workerSlice } from './worker';

import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { UserEvents } from '../../../src-tauri/api';
import { DevEnv } from '../../../src-tauri/api/database';

const blacklist = ['framerate', 'bitrate', 'internal_sync', 'metrics'];
const middleware: ThunkMiddleware = () => (next) => async (action) => {
    if (DevEnv) console.log({ ...(action as any) });
    else if (
        blacklist.filter((x) => (action as any).type.includes(x)).length == 0
    )
        UserEvents(action as any);

    return await next(action);
};

export const store = configureStore({
    devTools: true,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(middleware),
    reducer: {
        user: userSlice.reducer,
        wallpaper: wallSlice.reducer,
        globals: globalSlice.reducer,
        setting: settSlice.reducer,
        worker: workerSlice.reducer,
        popup: popupSlice.reducer,
        remote: remoteSlice.reducer,
        sidepane: sidepaneSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;

export const appDispatch = store.dispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const { update_language } = globalSlice.actions;
export const { user_delete, user_update } = userSlice.actions;
export const { setting_load, setting_setv, setting_theme, setting_togg } =
    settSlice.actions;
export const { worker_prev, worker_view } = workerSlice.actions;
export const { popup_close, popup_open } = popupSlice.actions;
export const {
    sidepane_bandhide,
    sidepane_bandtogg,
    sidepane_panetogg,
    sidepane_panehide,
    sidepane_paneopen,
    sidepane_panethem,
    render_message,
    push_notification,
    toggle_gamepad,
    toggle_keyboard,
    toggle_gamepad_setting,
    change_btnGp_size,
    toggle_gamepad_draggable,
    toggle_default_gamepad_position
} = sidepaneSlice.actions;

export const {
    remote_connect,
    remote_ready,
    share_reference,
    toggle_remote,
    loose_focus,
    have_focus,
    scancode,
    scancode_toggle,
    strict_timing,
    close_remote,
    change_bitrate,
    change_framerate,
    toggle_fullscreen,
    set_fullscreen,
    pointer_lock,
    homescreen,
    relative_mouse
} = remoteSlice.actions;

export const {
    unclaim_volume,
    fetch_local_worker,
    worker_session_access,
    worker_session_close,
    worker_session_create,
    worker_vm_create,
    worker_vm_create_from_volume,
    worker_refresh,
    worker_reload,
    wait_and_claim_volume,
    vm_session_create,
    vm_session_access,
    vm_session_close,
    peer_session_create,
    peer_session_access,
    peer_session_close
} = workerAsync;
export const { fetch_user } = userAsync;
export const {
    ping_session,
    sync,
    direct_access,
    save_reference,
    check_worker,
    load_setting,
    cache_setting,
    toggle_remote_async,
    hard_reset_async
} = remoteAsync;

export const { push_message, fetch_message } = sidepaneAsync;

export const dispatch_generic = async ({
    type,
    payload
}: {
    type: string;
    payload: any;
}) => {
    if (Object.keys(Actions).includes(type))
        (Actions as Record<string, any>)[type](payload);
    else if (Object.keys(actions).includes(type))
        store.dispatch((actions as Record<string, any>)[type](payload));
    else store.dispatch({ type, payload });
};
