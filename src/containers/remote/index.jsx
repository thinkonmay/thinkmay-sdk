import { useEffect, useRef } from 'react';
import {
    AudioWrapper,
    isMobile,
    RemoteDesktopClient,
    VideoWrapper
} from '../../../src-tauri/core';
import { Assign, CLIENT } from '../../../src-tauri/singleton';
import {
    appDispatch,
    set_fullscreen,
    useAppSelector
} from '../../backend/reducers';
import './remote.scss';

export const Remote = () => {
    const keyboard = useAppSelector(
        (state) => !state.sidepane.mobileControl.keyboardHide
    );
    const gamepad = useAppSelector(
        (state) => !state.sidepane.mobileControl.gamePadHide
    );
    useEffect(() => {
        if (CLIENT == null) return;
        else if (isMobile()) CLIENT?.PointerVisible(true);

        if (keyboard || gamepad) CLIENT.hid.disable = true;
        else CLIENT.hid.disable = false;

        CLIENT.touch.mode =
            isMobile() && !keyboard
                ? gamepad
                    ? 'gamepad'
                    : 'trackpad'
                : 'none';
    }, [gamepad, keyboard]);

    const { active, auth, scancode } = useAppSelector((store) => store.remote);
    const remoteVideo = useRef(null);
    const remoteAudio = useRef(null);
    useEffect(() => {
        if (!active || auth == undefined) return;
        SetupWebRTC();
    }, [active]);

    const SetupWebRTC = () =>
        Assign(
            () =>
                new RemoteDesktopClient(
                    new VideoWrapper(remoteVideo.current),
                    new AudioWrapper(remoteAudio.current),
                    auth.signaling,
                    auth.webrtc,
                    { scancode }
                )
        );

    const relative_mouse = useAppSelector((x) => x.remote.relative_mouse);
    const pointerlock = () => {
        appDispatch(set_fullscreen(true));
        remoteVideo.current.requestPointerLock();
    };
    return (
        <div className="relative">
            <video
                className="remote"
                ref={remoteVideo}
                onClick={relative_mouse ? pointerlock : null}
                autoPlay
                muted
                playsInline
                loop
            ></video>
            <audio
                ref={remoteAudio}
                autoPlay={true}
                playsInline={true}
                controls={false}
                muted={false}
                loop={true}
                style={{ zIndex: -5, opacity: 0 }}
            ></audio>
        </div>
    );
};
