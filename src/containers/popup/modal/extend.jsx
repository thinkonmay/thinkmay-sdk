import { MdInfoOutline } from 'react-icons/md';
import { UserEvents } from '../../../../src-tauri/api';
import {
    appDispatch,
    app_toggle,
    popup_close
} from '../../../backend/reducers';

export function extendService({ data: { type, to, available_time } }) {
    const deny = () => {
        UserEvents({
            type: 'payment/extends_service_denied',
            payload: { type, to, available_time }
        });
        appDispatch(popup_close());
    };
    return (
        <div className="w-[320px] h-auto p-[14px] rounded-lg flex flex-col gap-y-5">
            <div className="flex justify-center items-center gap-2 text-[#B0D0EF]">
                <MdInfoOutline className="text-3xl"></MdInfoOutline>
                {type == 'hour_limit' && available_time != undefined ? (
                    <h3 className="text-xl">
                        Dịch vụ hết hạn ngày <br /> {to}
                        <br />
                        Dịch vụ còn lại <br /> {available_time.toFixed(1)}h <br />
                    </h3>
                ) : (
                    <h3 className="text-xl">
                        Dịch vụ hết hạn ngày <br /> {to}
                    </h3>
                )}
            </div>

            <div>
                <p className="mt-[8px]">
                    Dữ liệu của bạn sẽ được dọn dẹp sau khi dịch vụ hết hạn
                    <br></br>
                    <br></br>
                    Gia hạn ngay?
                </p>
            </div>
            <div className="flex gap-3 justify-center mt-3 mb-2">
                <button
                    style={{ padding: '6px 14px' }}
                    className="text-base font-medium rounded-md"
                    onClick={deny}
                >
                    Không
                </button>
                <button
                    style={{ padding: '6px 14px' }}
                    onClick={() => appDispatch(app_toggle('payment'))}
                    className="cursor-pointer justify-center  text-base font-medium instbtn rounded-md"
                >
                    Có, gia hạn ngay
                </button>
            </div>
        </div>
    );
}
