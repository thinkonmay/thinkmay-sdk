import { useState } from 'react';

import {
    MdArrowBackIos,
    MdArrowForwardIos,
    MdComputer,
    MdLogout,
    MdOutlineVideoSettings
} from 'react-icons/md';

import {
    appDispatch,
    useAppSelector,
    wait_and_claim_volume
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import {
    clickDispatch
} from '../../backend/utils/dispatch';
import './taskbar.scss';

const Taskbar = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const [open, setOpen] = useState(true);
    const toggleControl = (e) => {
        setOpen((old) => !old);
    };

    return (
        <>
                <div
                    className={`${open ? 'slide-in' : 'slide-out'} taskright`}
                    data-remote={true}
                >
                        <button className="btn-show" onClick={toggleControl}>
                            {open ? (
                                <MdArrowForwardIos
                                    style={{ fontSize: '1.2rem' }}
                                ></MdArrowForwardIos>
                            ) : (
                                <MdArrowBackIos
                                    style={{ fontSize: '1.2rem' }}
                                ></MdArrowBackIos>
                            )}
                        </button>
                            <div
                                className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                                onClick={clickDispatch}
                                style={{ '--prefix': 'PANE' }}
                                data-action="user/user_delete"
                            >
                                <div className="text-xm flex gap-[4px] font-semibold">
                                    <MdComputer
                                        fontSize={'1.2rem'}
                                    ></MdComputer>
                                    Logout
                                </div>
                            </div>
                            <div
                                className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                                onClick={() => appDispatch(wait_and_claim_volume())}
                                data-action="worker/wait_and_claim_volume"
                            >
                                <div className="text-xm flex gap-[4px] font-semibold">
                                    <MdLogout
                                        fontSize={'1.2rem'}
                                    ></MdLogout>
                                    Connect
                                </div>
                            </div>
                            <div
                                className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                                onClick={clickDispatch}
                                style={{ '--prefix': 'PANE' }}
                                data-action="sidepane_panetogg"
                            >
                                <div className="text-xm flex gap-[4px] font-semibold">
                                    <MdOutlineVideoSettings
                                        fontSize={'1.2rem'}
                                    ></MdOutlineVideoSettings>
                                    {t[Contents.SETTING]}
                                </div>
                            </div>
                </div>
        </>
    );
};

export default Taskbar;
