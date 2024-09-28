import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
    supabaseGlobal,
    supabaseLocal
} from '../../../src-tauri/api/createClient';
import { BuilderHelper } from './helper';
import { Contents, Languages, language } from './locales';
export type Translation = Map<Languages, Map<Contents, string>>;
const translation = language();

export type TranslationResult = {
    [key in Contents]: string;
};
interface IGame {
    name: string;
    logo: string;
    publisher: string;
    created_at: string;
    metadata: {
        hide: boolean;
    };
}
interface Maintain {
    created_at: string;
    ended_at: string;
    isMaintaining?: boolean;
}
const initialState = {
    lays: [
        [
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: '50%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '66%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '34%',
                    height: '100%',
                    top: 0,
                    left: '66%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '33%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '34%',
                    height: '100%',
                    top: 0,
                    left: '33%'
                },
                br: 1
            },
            {
                dim: {
                    width: '33%',
                    height: '100%',
                    top: 0,
                    left: '67%'
                },
                br: 15
            }
        ],
        [
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%'
                },
                br: 3
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%'
                },
                br: 5
            }
        ],
        [
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: 0
                },
                br: 2
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: 0,
                    left: '50%'
                },
                br: 3
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: 0
                },
                br: 7
            },
            {
                dim: {
                    width: '50%',
                    height: '50%',
                    top: '50%',
                    left: '50%'
                },
                br: 5
            }
        ],
        [
            {
                dim: {
                    width: '25%',
                    height: '100%',
                    top: 0,
                    left: 0
                },
                br: 14
            },
            {
                dim: {
                    width: '50%',
                    height: '100%',
                    top: 0,
                    left: '25%'
                },
                br: 1
            },
            {
                dim: {
                    width: '25%',
                    height: '100%',
                    top: 0,
                    left: '75%'
                },
                br: 15
            }
        ]
    ],

    service_available: false,
    translation: {} as TranslationResult,
    maintenance: {} as Maintain,
    apps: [],
    games: [] as IGame[]
};

export const globalAsync = {
    fetch_store: createAsyncThunk('fetch_store', async () => {
        const { data, error } = await supabaseGlobal.rpc('fetch_store');
        if (error) throw new Error(error.message);
        return data as IGame[];
    }),
    fetch_under_maintenance: createAsyncThunk(
        'fetch_under_maintenance',
        async () => {
            const {
                data: [{ value: info }],
                error
            } = await supabaseLocal
                .from('constant')
                .select('value')
                .eq('name', 'mantainance');
            if (error) throw new Error(error.message);

            return info != undefined &&
                new Date() > new Date(info.created_at) &&
                new Date() < new Date(info.ended_at)
                ? {
                      ...info,
                      isMaintaining: true
                  }
                : {};
        }
    )
};

export const globalSlice = createSlice({
    name: 'global',
    initialState,
    reducers: {
        update_language: (state, action: PayloadAction<Languages>) => {
            translation.forEach((val, key) => {
                if (key != action.payload) return;

                val.forEach((val, key) => {
                    state.translation[key] = val;
                });
            });
        },
        update_store_data: (state, payload: any) => {
            state.games = payload;
        }
    },
    extraReducers: (builder) => {
        BuilderHelper(
            builder,
            {
                fetch: globalAsync.fetch_store,
                hander: (state, action: PayloadAction<IGame[]>) => {
                    state.games = action.payload.filter(
                        (g) => g.metadata?.hide != true
                    );
                }
            },
            {
                fetch: globalAsync.fetch_under_maintenance,
                hander: (state, action: PayloadAction<Maintain>) => {
                    state.maintenance = action.payload;
                }
            }
        );
    }
});
