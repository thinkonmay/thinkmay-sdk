import {
    app_toggle,
    appDispatch,
    useAppSelector,
    wait_and_claim_volume
} from '../../../backend/reducers';
import {
    Icon,
    LazyComponent,
    ToolBar
} from '../../../components/shared/general';

import { RenderNode } from '../../../../src-tauri/api';
import './assets/connect.scss';
export const ConnectApp = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const wnapp = useAppSelector((state) =>
        state.apps.apps.find((x) => x.id == 'connectPc')
    );
    const available = useAppSelector(
        (state) =>
            new RenderNode(state.worker.data).data[0]?.info?.available &&
            !state.globals.maintenance?.isMaintaining
    );

    const [email]= useAppSelector((state) => state.user.email.split('@'));
    const connect = () => appDispatch(wait_and_claim_volume());
    const pay = () => appDispatch(app_toggle('payment'));
    return (
        <div
            className="connectToPcApp floatTab dpShad"
            data-size={wnapp.size}
            id={wnapp.id + 'App'}
            data-max={wnapp.max}
            style={{
                ...(wnapp.size == 'cstm' ? wnapp.dim : null),
                zIndex: wnapp.z
            }}
            data-hide={wnapp.hide}
        >
            <div
                className="windowScreen connectAppContent flex flex-col p-[12px] pt-0"
                data-dock="true"
            >
                <LazyComponent show={!wnapp.hide}>
                    <div className="content">
                        <div className="title">
                            <Icon src="monitor"></Icon>
                            { email }
                        </div>

                        <div className="containerSpec">
                            {available ? (
                                <button
                                    onClick={connect}
                                    className="instbtn connectBtn"
                                >
                                    Connect
                                </button>
                            ) : (
                                <button
                                    onClick={pay}
                                    className="instbtn connectBtn"
                                >
                                    Pay Now
                                </button>
                            )}
                        </div>
                    </div>
                </LazyComponent>
            </div>
        </div>
    );
};
