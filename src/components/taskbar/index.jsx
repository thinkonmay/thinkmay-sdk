import { useState } from 'react';

import {
    MdArrowBackIos,
    MdArrowForwardIos,
    MdComputer,
    MdLogin,
    MdLogout,
    MdOutlineVideoSettings
} from 'react-icons/md';

import { login } from '../../backend/actions';
import {
    appDispatch,
    useAppSelector,
    wait_and_claim_volume
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import { clickDispatch } from '../../backend/utils/dispatch';
import './taskbar.scss';

const Taskbar = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const id = useAppSelector((state) => state.user.id);
    const active = useAppSelector((state) => state.remote.active);
    const [open, setOpen] = useState(true);
    const toggleControl = (e) => {
        setOpen((old) => !old);
    };

    const loginPassword = () => {
        login('password').catch(e => {
            alert('Invalid login '+ e.message)
        })
    }

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

                {id == 'unknown' ? (
                    <>
                        <div
                            className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                            onClick={loginPassword}
                            style={{ '--prefix': 'PANE' }}
                            data-action="user/user_delete"
                        >
                            <div className="text-xm flex gap-[4px] font-semibold">
                                <MdLogin fontSize={'1.2rem'}></MdLogin>
                                Login
                            </div>
                        </div>
                    </>
                ) : !active ? (
                    <>
                        <div
                            className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                            onClick={clickDispatch}
                            style={{ '--prefix': 'PANE' }}
                            data-action="user/user_delete"
                        >
                            <div className="text-xm flex gap-[4px] font-semibold">
                                <MdComputer fontSize={'1.2rem'}></MdComputer>
                                Logout
                            </div>
                        </div>
                        <div
                            className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                            onClick={() => appDispatch(wait_and_claim_volume())}
                            data-action="worker/wait_and_claim_volume"
                        >
                            <div className="text-xm flex gap-[4px] font-semibold">
                                <MdLogout fontSize={'1.2rem'}></MdLogout>
                                Connect
                            </div>
                        </div>
                    </>
                ) : null}
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
