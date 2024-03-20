import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    RootState,
    appDispatch,
    authenticate_session,
    open_remote,
    ready
} from '.';
import { RenderNode } from '../utils/tree';
import {
    AccessApplication,
    AddSubscription,
    AdjustSubscription,
    ConfigureApplication,
    CreateWorkerSession,
    DeactivateWorkerSession,
    DeleteApplication,
    DeleteVolume,
    FetchAuthorizedWorkers,
    ForkVolume,
    IModifySubscriptionAction,
    ModifySubscription,
    PatchApp,
    SetDefaultOsVolume,
    StopApplication,
    StopVolume
} from './fetch';
import { CAUSE } from './fetch/createClient';
import { BuilderHelper, CacheRequest } from './helper';
import { openRemotePage } from './remote';

type WorkerType = {
    data: any;
    cpath: string;
    cdata: any[];

    hist: any[];
    hid: number;
};

const initialState: WorkerType = {
    data: null,

    cpath: '',
    cdata: [],

    hist: [],
    hid: 0
};

interface NewSubscription {
    email: string;
    plan: string;
    free: string;
    price: string;
    additional_time: number;
}
interface IPatchApp {
    app_id: number,
    desc: string,
}
export const workerAsync = {
    fetch_worker: createAsyncThunk('fetch_worker', async (): Promise<any> => {
        return await CacheRequest('worker', 90, async () => {
            return new RenderNode(await FetchAuthorizedWorkers()).any();
        });
    }),
    access_volume: createAsyncThunk(
        'access_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            const result = await AccessApplication({ volume_id });
            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url);

            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(volume_id));
            await ready();
        }
    ),
    stop_volume: createAsyncThunk(
        'stop_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            await StopVolume(volume_id);
        }
    ),
    delete_volume: createAsyncThunk(
        'delete_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            await DeleteVolume(volume_id);
        }
    ),
    default_os_volume: createAsyncThunk(
        'default_os_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            let cluster_id = '09793ad1-82e5-46ad-8183-f72e7e9fe85c';
            await SetDefaultOsVolume(volume_id, cluster_id);
        }
    ),
    // migrate_volume: createAsyncThunk(
    //     'fetch_worker',
    //     async (arg, { getState }): Promise<any> => {
    //         // await MigrateVolume(volume, cluster_id);
    //     }
    // ),
    fork_volume: createAsyncThunk(
        'fork_volume',
        async (volume_id: string, { getState }): Promise<any> => {
            volume_id = volume_id.split(' ').at(-1);
            let cluster_id = '09793ad1-82e5-46ad-8183-f72e7e9fe85c';
            let gpu_model = 'RTX 3060Ti';
            let vcpus = '8';
            let ram = '8';
            let description = `fork volume ${new Date().toUTCString()}`;
            await ForkVolume(
                volume_id,
                cluster_id,
                gpu_model,
                vcpus,
                ram,
                description
            );
        }
    ),

    access_storage: createAsyncThunk(
        'access_storage',
        async (storage_id: string, { getState }): Promise<any> => {
            const result = await AccessApplication({ storage_id });
            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url);
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(storage_id));
            await ready();
        }
    ),
    stop_storage: createAsyncThunk(
        //TODO
        'stop_storage',
        async (storage_id: string, { getState }) => {
            await StopApplication(storage_id);
        }
    ),
    delete_storage: createAsyncThunk(
        //TODO
        'delete_storage',
        async (storage_id: string, { getState }) => {
            await DeleteApplication(storage_id);
        }
    ),

    create_session: createAsyncThunk(
        'create_session',
        async (worker_session_id: string, { getState }): Promise<any> => {
            await CreateWorkerSession(worker_session_id);
        }
    ),

    deactivate_session: createAsyncThunk(
        'deactivate_session',
        async (worker_session_id: string, { getState }): Promise<any> => {
            await DeactivateWorkerSession(worker_session_id);
        }
    ),

    access_worker: createAsyncThunk(
        'access_worker',
        async (worker_profile_id: string, { getState }): Promise<any> => {
            const result = await CreateWorkerSession(worker_profile_id);
            if ((getState() as RootState).remote.old_version)
                return openRemotePage(result.url);
            const url = new URL(result.url);
            const ref = url.searchParams.get('ref');
            if (ref == null)
                throw new Error(JSON.stringify({ code: CAUSE.INVALID_REF }));

            await appDispatch(authenticate_session({ ref }));
            appDispatch(open_remote(worker_profile_id));
            await ready();
        }
    ),

    create_subscription: createAsyncThunk(
        'create_subscription',
        async (data: NewSubscription): Promise<any> => {
            const { email, plan, free, price, additional_time } = data;

            await AddSubscription({
                email,
                plan,
                free,
                price,
                additional_time
            });
        }
    ),
    renew_subscription: createAsyncThunk(
        'renew_subscription',
        async (email: string, { getState }): Promise<any> => {
            await ModifySubscription({
                action: 'RENEW',
                email
            });
        }
    ),
    upgrade_subscription: createAsyncThunk(
        'upgrade_subscription',
        async (data: IModifySubscriptionAction, { getState }): Promise<any> => {
            await ModifySubscription(data);
        }
    ),
    cancel_subscription: createAsyncThunk(
        'cancel_subscription',
        async (email: string, { getState }): Promise<any> => {
            await ModifySubscription({
                action: 'CANCEL',
                email
            });
        }
    ),

    adjust_subscription: createAsyncThunk(
        'adjust_subscription',
        async (email: string, { getState }): Promise<any> => {
            let created_at = '';
            let ends_at = '';

            await AdjustSubscription({
                email,
                created_at,
                ends_at
            });
        }
    ),
    release_app: createAsyncThunk(
        'release_app',
        async (store_id: number, { getState }): Promise<any> => {
            let vol_speed = 'HOT';
            let vol_availability = 'HA';

            let vdriver = true;
            let hidevm = false;

            let desc = `release ${new Date().toUTCString()}`;
            let cluster_id = '09793ad1-82e5-46ad-8183-f72e7e9fe85c';
            let gpu_model = 'RTX 3060Ti';
            let vcpus = '8';
            let ram = '8';
            await ConfigureApplication({
                vol_speed,
                vol_availability,
                gpu_model,
                desc,
                store_id,
                vcpus,
                ram,
                vdriver,
                hidevm,
                cluster_id
            });
        }
    ),
    patch_app: createAsyncThunk(
        'patch_app',
        async (patchAppInputs: IPatchApp, { getState }): Promise<any> => {
            const { app_id, desc } = patchAppInputs
            let cluster_id = '09793ad1-82e5-46ad-8183-f72e7e9fe85c';
            await PatchApp({
                app_id,
                desc: desc + ` ${new Date().toUTCString()}`,
                cluster_id
            });
        }
    )
};

export const workerSlice = createSlice({
    name: 'worker',
    initialState,
    reducers: {
        worker_view: (state, action: PayloadAction<string | number>) => {
            const paths = state.cpath.split('/').filter((x) => x.length > 0);
            paths.push(`${action.payload}`);
            state.cpath = paths.join('/');

            let temp: RenderNode<any>[] = [];
            let target: RenderNode<any> = state.data;
            paths.forEach((x) => {
                temp = new RenderNode(target).data;
                target = temp.find((y) => y.id == x) ?? target;
            });

            state.cdata = target.data.map((x) => x.any());
        },
        worker_prev: (state, action: PayloadAction<any>) => {
            const paths = state.cpath.split('/').filter((x) => x.length > 0);
            paths.pop();
            state.cpath = paths.join('/');
            if (paths.length == 0) {
                state.cdata = new RenderNode(state.data).data.map((x) =>
                    x.any()
                );
                return;
            }

            let temp: RenderNode<any>[] = [];
            let target: RenderNode<any> = state.data;
            paths.forEach((x) => {
                temp = new RenderNode(target).data;
                target = temp.find((y) => y.id == x) ?? target;
            });

            state.cdata = target.data.map((x) => x.any());
        }
    },
    extraReducers: (build) => {
        BuilderHelper<WorkerType, any, any>(
            build,
            {
                fetch: workerAsync.fetch_worker,
                hander: (state, action) => {
                    state.data = action.payload;
                    const paths = state.cpath
                        .split('/')
                        .filter((x) => x.length > 0);
                    if (paths.length == 0) {
                        state.cdata = new RenderNode(state.data).data.map((x) =>
                            x.any()
                        );
                        return;
                    }

                    let temp: RenderNode<any>[] = [];
                    let target: RenderNode<any> = state.data;
                    paths.forEach((x) => {
                        temp = new RenderNode(target).data;
                        target = temp.find((y) => y.id == x) ?? target;
                    });

                    state.cdata = target.data.map((x) => x.any());
                }
            },
            {
                fetch: workerAsync.access_worker,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.release_app,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.patch_app,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.cancel_subscription,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.adjust_subscription,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.renew_subscription,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.create_subscription,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.upgrade_subscription,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.fork_volume,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.access_storage,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.delete_storage,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.stop_storage,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.stop_volume,
                hander: (state, action) => {}
            },
            {
                fetch: workerAsync.delete_volume,
                hander: (state, action) => {}
            }
        );
    }
});
