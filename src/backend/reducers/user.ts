import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { RecordModel } from 'pocketbase';
import { POCKETBASE } from '../../../src-tauri/api';
import { BuilderHelper } from './helper';
type Usage = {
    node: string;
    total_usage: number;
    template: {
        image: string | null;
        code: string;
        name: string;
    };
    isExpired?: boolean;
};

type Data = RecordModel & {
    volume_id: string;
};

const notexpired = () =>
    `ended_at.gt.${new Date().toISOString()},ended_at.is.${null}`;
const isUUID = (uuid) =>
    uuid.match(
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    ) != null;
const initialState: Data = {
    collectionId: '',
    collectionName: '',

    id: 'unknown',
    email: '',
    volume_id: '',
    created: '',
    updated: ''
};

export const userAsync = {
    fetch_user: createAsyncThunk(
        'fetch_user',
        async (): Promise<RecordModel & { volume_id: string }> => {
            const {
                items: [result]
            } = await POCKETBASE.collection('users').getList(1);
            const [vol] = await POCKETBASE.collection('volumes').getFullList<{
                local_id: string;
            }>();

            return result != undefined
                ? vol != undefined
                    ? { ...result, volume_id: vol.local_id }
                    : { ...result, volume_id: '' }
                : initialState;
        }
    )
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        user_update: (
            state,
            action: PayloadAction<RecordModel & { volume_id: string }>
        ) => {
            state.id = action.payload.id;
            state.collectionId = action.payload.collectionId;
            state.collectionName = action.payload.collectionName;
            state.created = action.payload.created;
            state.updated = action.payload.updated;
            state.email = action.payload.email;
            state.expand = action.payload.expand;
            state.volume_id = action.payload.volume_id;
        },
        user_delete: (state) => {
            state.id = initialState.id;
            state.stat = initialState.stat;
            POCKETBASE.authStore.clear();
        }
    },
    extraReducers: (builder) => {
        BuilderHelper<Data, any, any>(builder, {
            fetch: userAsync.fetch_user,
            hander: (state, action) => {
                state.id = action.payload.id;
                state.collectionId = action.payload.collectionId;
                state.collectionName = action.payload.collectionName;
                state.created = action.payload.created;
                state.updated = action.payload.updated;
                state.expand = action.payload.expand;
                state.email = action.payload.email;
                state.stat = action.payload.stat;
                state.volume_id = action.payload.volume_id;
            }
        });
    }
});
