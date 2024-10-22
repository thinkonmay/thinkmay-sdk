import ReactModal from 'react-modal';
import { useAppSelector } from '../../backend/reducers';
import './index.scss';
import * as modals from './modal';

const Popup = () => {
    const popup = useAppSelector(
        (state) =>
            state.popup.data_stack.find(
                (x) => x.type == 'complete' && !x.data.success
            ) ??
            state.popup.data_stack.find((x) => x.type == 'notify') ??
            state.popup.data_stack[-1]
    );

    const closeModal = () => {};
    return (
        <>
            {popup != undefined ? (
                <ReactModal
                    isOpen={true}
                    contentLabel="Modal"
                    className="modalContent "
                    overlayClassName="modalOverlay"
                    onRequestClose={closeModal}
                    style={{ 'backdrop-filter': 'blur(3px) brightness(0.5)' }}
                >
                    <div className="selectText d-flex overflow-auto min-h-full">
                        {Object.keys(modals)
                            .filter((x) => x == popup.type)
                            .map((key, idx) => {
                                const Modal = modals[key];
                                return <Modal key={idx} data={popup.data} />;
                            })}
                    </div>
                </ReactModal>
            ) : null}
        </>
    );
};

export default Popup;
