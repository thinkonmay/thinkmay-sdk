import { useAppSelector } from '../../backend/reducers';
import './back.scss';
import './getstarted.scss';

export const Background = () => {
    const src = useAppSelector((state) => state.wallpaper.src);
    return (
        <div
            className="background"
            style={{
                backgroundImage: `url(img/wallpaper/${src})`
            }}
        ></div>
    );
};
