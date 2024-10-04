import {
    useAppSelector
} from '../../backend/reducers';
import './back.scss';
import './getstarted.scss';

export const Background = () => {
    const wall = useAppSelector((state) => state.wallpaper);
    return (
        <div
            className="background"
            style={{
                backgroundImage: `url(img/wallpaper/${wall.src})`
            }}
        ></div>
    );
};
