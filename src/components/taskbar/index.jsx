import { useEffect, useState } from 'react';
import useSound from 'use-sound';
import ringSound from '/audio/ring2.mp3';

import {
    MdArrowBackIos,
    MdArrowForwardIos,
    MdOutlineVideoSettings
} from 'react-icons/md';

import {
    appDispatch,
    task_hide,
    task_show,
    useAppSelector
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import {
    clickDispatch
} from '../../backend/utils/dispatch';
import { Icon } from '../shared/general';
import './taskbar.scss';

const Taskbar = () => {
    const t = useAppSelector((state) => state.globals.translation);
    const dispatch = appDispatch;
    const remote = useAppSelector((state) => state.remote);
    const tasks = useAppSelector((state) => state.taskbar);
    const apps = useAppSelector((state) => state.apps);
    const [open, setOpen] = useState(true);
    const defaultapps = useAppSelector((state) =>
        state.apps.apps.filter((x) => state.taskbar.apps.includes(x.id))
    );
    const tempapps = useAppSelector((state) =>
        state.apps.apps
            .filter((x) => !x.hide)
            .filter((x) => defaultapps.find((y) => y.id == x.id) == undefined)
    );

    const showPrev = (event) => {
        var ele = event.target;
        while (ele && ele.getAttribute('value') == null)
            ele = ele.parentElement;

        var appPrev = ele.getAttribute('value');
        var xpos = window.scrollX + ele.getBoundingClientRect().left;

        var offsetx = Math.round((xpos * 10000) / window.innerWidth) / 100;

        dispatch(
            task_show({
                app: appPrev,
                pos: offsetx
            })
        );
    };

    const hidePrev = () => {
        dispatch(task_hide());
    };

    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    const [play] = useSound(ringSound, { volume: 0.1 });

    useEffect(() => {
        remote?.active ? play() : null;
    }, [remote.active]);

    const toggleControl = (e) => {
        setOpen((old) => !old);
    };

    return (
        <>
            {remote.active ? (
                <div
                    className={`${open ? 'slide-in' : 'slide-out'} taskright`}
                    data-remote={remote.active}
                >
                    {remote.active ? (
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
                    ) : null}

                    <>
                        <div
                            className="p-2 prtclk handcr hvlight flex rounded "
                            onClick={customDispatch}
                            data-action="sidepane/sidepane_bandtogg"
                        >
                            <div
                                className="text-xm font-semibold"
                                style={{ color: '#0167c0' }}
                            >
                                {t[Contents.SUPPORT]}
                            </div>
                        </div>
                        <div
                            className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                            onClick={customDispatch}
                            data-action="sidepane_panetogg"
                        >
                            {remote.connection?.video == 'connected' ? (
                                <Icon
                                    className="taskIcon"
                                    src={
                                        remote.frame_drop ? 'wifi_low' : 'wifi'
                                    }
                                    ui
                                    width={16}
                                />
                            ) : null}
                            <div className="text-xm flex gap-[4px] font-semibold">
                                <MdOutlineVideoSettings
                                    fontSize={'1.2rem'}
                                ></MdOutlineVideoSettings>
                                {t[Contents.SETTING]}
                            </div>
                        </div>
                    </>
                </div>
            ) : (
                <div
                    className="taskbar"
                    data-remote={remote.active}
                    style={!remote.active ? { '--prefix': 'TASK' } : {}}
                >
                    <audio src={ringSound}></audio>
                    {remote.active ? null : (
                        <div className="tasksCont" data-side={tasks.align}>
                            <div className="tsbar" onMouseOut={hidePrev}>
                                <Icon
                                    className="tsIcon tsIconInvert"
                                    src="home"
                                    width={24}
                                    click="startmenu/startogg"
                                    style={{ '--prefix': 'START' }}
                                />
                            </div>
                        </div>
                    )}
                    <div
                        className={`${
                            open ? 'slide-in' : 'slide-out'
                        } taskright`}
                        data-remote={remote.active}
                    >
                        {remote.active ? (
                            <button
                                className="btn-show"
                                onClick={() => setOpen((old) => !old)}
                            >
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
                        ) : null}

                        <>
                            <div
                                className="prtclk handcr my-1 p-2 hvlight flex gap-[8px] rounded"
                                onClick={clickDispatch}
                                style={{ '--prefix': 'PANE' }}
                                data-action="sidepane_panetogg"
                            >
                                {remote.connection?.video == 'connected' ? (
                                    <Icon
                                        className="taskIcon"
                                        src={
                                            remote.frame_drop
                                                ? 'wifi_low'
                                                : 'wifi'
                                        }
                                        ui
                                        width={16}
                                    />
                                ) : null}
                                <div className="text-xm flex gap-[4px] font-semibold">
                                    <MdOutlineVideoSettings
                                        fontSize={'1.2rem'}
                                    ></MdOutlineVideoSettings>
                                    {t[Contents.SETTING]}
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            )}
        </>
    );
};

export default Taskbar;
