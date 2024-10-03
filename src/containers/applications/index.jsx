import { useAppSelector } from '../../backend/reducers';
import './tabs.scss';
import './tabs2.scss';
import './wnapp.scss';

export * from './apps/connect';

export const ScreenPreview = () => {
    const tasks = useAppSelector((state) => state.taskbar);

    return (
        <div className="prevCont" style={{ left: tasks.prevPos + '%' }}>
            <div
                className="prevScreen"
                id="prevApp"
                data-show={tasks.prev && false}
            >
                <div id="prevsc"></div>
            </div>
        </div>
    );
};
