import { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ReactModal from 'react-modal';
import { UserEvents } from '../src-tauri/api';
import { preload } from './backend/actions/background';
import {
    appDispatch,
    direct_access,
    pointer_lock,
    set_fullscreen,
    useAppSelector
} from './backend/reducers';
import { SidePane } from './components/start';
import Taskbar from './components/taskbar';
import { Background } from './containers/background';
import Popup from './containers/popup';
import { Remote } from './containers/remote';
import { Status } from './containers/status';
import { ErrorFallback } from './error';
import './index.css';
import './tabs.scss';
import './tabs2.scss';
import './wnapp.scss';

function App() {
    ReactModal.setAppElement('#root');
    const remote = useAppSelector((x) => x.remote);
    const pointerLock = useAppSelector((state) => state.remote.pointer_lock);

    const ctxmenu = (e) => {
        e.preventDefault();
    };

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

        const now = () => new Date().getTime();
        const start_fetch = now();
        preload().finally(async () => {
            window.history.replaceState({}, document.title, '/' + '');
            const finish_fetch = now();
            const interval = finish_fetch - start_fetch;
            UserEvents({ type: 'preload/finish', payload: { interval } });
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

    const exitpointerlock = () => document.exitPointerLock();

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
                <div className="appwrap ">
                    {pointerLock ? null : (
                        <>
                            <Taskbar />
                            <Status />
                            <SidePane />
                            <Popup />
                        </>
                    )}
                    {remote.active ? <Remote /> : <Background />}
                </div>
            </ErrorBoundary>
        </div>
    );
}

export default App;
