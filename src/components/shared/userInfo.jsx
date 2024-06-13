import { useMemo } from 'react';
import { changeTheme } from '../../backend/actions';
import {
    appDispatch,
    useAppSelector,
    user_delete
} from '../../backend/reducers';
import { Contents } from '../../backend/reducers/locales';
import LangSwitch from '../../containers/applications/apps/assets/Langswitch';
import { Icon } from './general';
import './index.scss';
function UserInfo() {
    const user = useAppSelector((state) => state.user);
    const stats = useAppSelector((state) => state.user.stat);
    const thm = useAppSelector((state) => state.setting.person.theme);
    var icon = thm == 'light' ? 'sun' : 'moon';
    const t = useAppSelector((state) => state.globals.translation);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const additionalTime = stats?.additional_time ?? 0;
    const planUsageTime = stats?.plan_hour ?? 0;
    const _planName = stats?.plan_name ?? '';
    //const totalTime = +planUsageTime + +additionalTime;

    const totalTime = useMemo(() => {
        let total = 0;
        if (_planName == 'hour_01') {
            total = +additionalTime;
        } else {
            total = +planUsageTime + +additionalTime;
        }

        return total;
    }, [_planName]);

    const renderPlanName = (planName) => {
        let name = '';
        if (planName == 'month_01') {
            name = 'Cơ bản';
        } else if (planName == 'month_02') {
            name = 'Tiêu chuẩn';
        } else if (planName == 'hour_01') {
            name = 'Gói giờ';
        }
        return name;
    };

    const PlanMonth = () => {
        return (
            <div className="restWindow w-full  flex flex-col ">
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.PLAN_NAME]}</span>
                    <span>{renderPlanName(stats?.plan_name)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.STARTAT]}</span>
                    <span>{formatDate(stats?.start_time)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.ENDAT]}</span>
                    <span>{formatDate(stats?.end_time)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-3 items-end">
                    <span className="text-left">
                        {t[Contents.PLAN_USAGE_TIME]}
                    </span>
                    <span>{planUsageTime}h</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1 items-end">
                    <span className="text-left">
                        {t[Contents.ADDITIONAL_TIME]}
                    </span>
                    <span>{additionalTime}h</span>
                </div>
                <hr className="my-[14px]" />
                <div className="w-full flex gap-4 justify-between  mt-0 md:mt-[14px]">
                    <span className="text-left">{t[Contents.TIME]}</span>
                    <span>
                        {stats?.usage_hour ? stats?.usage_hour.toFixed(1) : 0}h
                        / {totalTime + 'h'}
                    </span>
                </div>
            </div>
        );
    };

    const PlanHours = () => {
        return (
            <div className="restWindow w-full  flex flex-col ">
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">{t[Contents.PLAN_NAME]}:</span>
                    <span>{renderPlanName(stats?.plan_name)}</span>
                </div>
                {/*<div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">
                        {t[Contents.STARTAT]}
                    </span>
                    <span>{formatDate(stats?.start_time)}</span>
                </div>
                <div className="w-full flex gap-4 justify-between mt-1">
                    <span className="text-left">
                        {t[Contents.ENDAT]}
                    </span>
                    <span>{formatDate(stats?.end_time)}</span>
                </div>*/}
                <div className="w-full flex gap-4 justify-between mt-3 items-end">
                    <span className="text-left">Time:</span>
                    <span>{additionalTime}h</span>
                </div>

                <hr className="my-[14px]" />
                <div className="w-full flex gap-4 justify-between  mt-0 md:mt-[14px]">
                    <span className="text-left">{t[Contents.TIME]}:</span>
                    <span>
                        {stats?.usage_hour ? stats?.usage_hour.toFixed(1) : 0}h
                        / {totalTime + 'h'}
                    </span>
                </div>
            </div>
        );
    };
    return (
        <div className="userManager">
            <div className="stmenu  p-[14px]">
                <div className="pinnedApps mt-[16px] text-center font-semibold pb-1 flex items-center justify-center gap-2">
                    <span>{user.email ?? 'Admin'}</span>
                    <Icon
                        className="quickIcon"
                        //ui={true}
                        src={'active'}
                        width={14}
                    />
                </div>
                <div className="h-full flex flex-col p-2" data-dock="true">
                    <div className="w-full flex gap-4 justify-between my-[8px] ">
                        <span>Language</span>
                        <LangSwitch />
                    </div>
                    <div className="w-full flex gap-4 justify-between mb-[12px] md:mb-[24px] ">
                        <span>Theme</span>
                        <div
                            className="strBtn handcr prtclk"
                            onClick={changeTheme}
                        >
                            <Icon
                                className="quickIcon"
                                ui={true}
                                src={icon}
                                width={14}
                                //invert={pnstates[idx] ? true : null}
                            />
                        </div>
                    </div>

                    {/* here */}
                    {_planName == 'hour_01' ? <PlanHours /> : <PlanMonth />}
                </div>
            </div>

            <div className="menuBar">
                <div
                    className="w-full h-full flex cursor-pointer prtclk items-center justify-center gap-2"
                    onClick={() => appDispatch(user_delete())}
                    data-action="WALLSHUTDN"
                >
                    <svg
                        width="18"
                        height="18"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M8.204 4.82a.75.75 0 0 1 .634 1.36A7.51 7.51 0 0 0 4.5 12.991c0 4.148 3.358 7.51 7.499 7.51s7.499-3.362 7.499-7.51a7.51 7.51 0 0 0-4.323-6.804.75.75 0 1 1 .637-1.358 9.01 9.01 0 0 1 5.186 8.162c0 4.976-4.029 9.01-9 9.01C7.029 22 3 17.966 3 12.99a9.01 9.01 0 0 1 5.204-8.17ZM12 2.496a.75.75 0 0 1 .743.648l.007.102v7.5a.75.75 0 0 1-1.493.102l-.007-.102v-7.5a.75.75 0 0 1 .75-.75Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;
