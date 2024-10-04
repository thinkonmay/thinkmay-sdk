import { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { UserEvents } from '../src-tauri/api';
import { isMobile } from '../src-tauri/core';
import { preload } from './backend/actions/background';
import {
    appDispatch,
    direct_access,
    pointer_lock,
    set_fullscreen,
    setting_theme,
    update_language,
    useAppSelector
} from './backend/reducers';
import { Contents } from './backend/reducers/locales';
import {
    LogMaintain,
    SidePane
} from './components/start';
import Taskbar from './components/taskbar';
import { Background, BootScreen, LockScreen } from './containers/background';
import Popup from './containers/popup';
import { Remote } from './containers/remote';
import { Status } from './containers/status';
import { ErrorFallback } from './error';
import './index.css';

function App() {
    ReactModal.setAppElement('#root');
    const remote = useAppSelector((x) => x.remote);
    const user = useAppSelector((state) => state.user);
    const pointerLock = useAppSelector((state) => state.remote.pointer_lock);
    const [booting, setLockscreen] = useState(true);
    const isMaintaining = useAppSelector(
        (state) => state.globals.maintenance?.isMaintaining
    );

    const ctxmenu = (e) => {
        e.preventDefault();
    };

    const [loadingText, setloadingText] = useState(Contents.BOOTING);

    useEffect(() => {
        const url = new URL(window.location.href);

        const ref = url.searchParams.get('ref');
        if (ref != null) {
            appDispatch(direct_access({ ref }));
            window.onbeforeunload = (e) => {
                const text = 'Are you sure (｡◕‿‿◕｡)';
                e = e || window.event;
                if (e) e.returnValue = text;
                return text;
            };
        }

        const waitForPhoneRotation = async () => {
            const finish_fetch = now();
            while (
                window.screen.width < window.screen.height &&
                !(now() - finish_fetch > 2 * 1000)
            ) {
                setloadingText(Contents.ROTATE_PHONE);
                await new Promise((r) => setTimeout(r, 100));
            }
        };

        const now = () => new Date().getTime();
        const start_fetch = now();
        preload().finally(async () => {
            window.history.replaceState({}, document.title, '/' + '');
            const finish_fetch = now();
            const interval = finish_fetch - start_fetch;
            UserEvents({ type: 'preload/finish', payload: { interval } });
            if (isMobile()) await waitForPhoneRotation();
            setLockscreen(false);
            appDispatch(update_language('VN'))
            appDispatch(setting_theme('light'))
        });
    }, []);

    const fullscreen = async () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            /* Safari */
            await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            /* IE11 */
            await elem.msRequestFullscreen();
        }
    };

    const exitfullscreen = async () => {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            /* Safari */
            await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE11 */
            await document.msExitFullscreen();
        }
    };

    useEffect(() => {
        if (remote.fullscreen) {
            window.onclick = null;
            window.oncontextmenu = (ev) => ev.preventDefault();
        } else {
            window.oncontextmenu = ctxmenu;
        }

        const job = remote.fullscreen ? fullscreen() : exitfullscreen();
        job?.catch(() => {});

        const handleState = () => {
            const fullscreen =
                document.fullscreenElement != null ||
                document.webkitFullscreenElement != null ||
                document.mozFullScreenElement != null;
            if (fullscreen == remote.fullscreen) return;

            appDispatch(set_fullscreen(fullscreen));
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => clearInterval(UIStateLoop);
    }, [remote.fullscreen]);

    const exitpointerlock = () => {
        document.exitPointerLock();
    };

    useEffect(() => {
        const handleState = () => {
            const fullscreen =
                document.fullscreenElement != null ||
                document.webkitFullscreenElement != null ||
                document.mozFullScreenElement != null;
            const havingPtrLock =
                document.pointerLockElement != null ||
                document.mozPointerLockElement != null ||
                document.webkitPointerLockElement != null;

            if (!fullscreen && havingPtrLock) exitpointerlock();
            if (havingPtrLock != remote.pointer_lock)
                appDispatch(pointer_lock(havingPtrLock));
        };

        const UIStateLoop = setInterval(handleState, 100);
        return () => {
            clearInterval(UIStateLoop);
        };
    }, [remote.pointer_lock]);

    return (
        <div className="App">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
                {booting ? <BootScreen loadingText={loadingText} /> : null}
                {user.id == 'unknown' && !remote.active ? <LockScreen /> : null}
                <div className="appwrap ">
                    {pointerLock ? null : (
                        <>
                            <Taskbar />
                            <Status />
                            <SidePane />
                            <Popup />
                        </>
                    )}

                    {remote.active ? (
                            <Remote />
                    ) : (
                        <Background />
                    )}
                    <div className="desktop" data-menu="desk"> </div>
                </div>
                {isMaintaining ? <LogMaintain /> : null}
            </ErrorBoundary>
        </div>
    );
}

export default App;
