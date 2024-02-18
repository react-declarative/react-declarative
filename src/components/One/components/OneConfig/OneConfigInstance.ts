import { BLUR_DEBOUNCE, FIELD_DEBOUNCE } from "../../config/config";

export interface IConfig {
    WITH_DIRTY_CLICK_LISTENER: boolean;
    WITH_MOBILE_READONLY_FALLBACK: boolean;
    WITH_WAIT_FOR_MOVE_LISTENER: boolean;
    WITH_WAIT_FOR_TAB_LISTENER: boolean;
    WITH_WAIT_FOR_TOUCH_LISTENER: boolean;
    WITH_DISMOUNT_LISTENER: boolean;
    WITH_SYNC_COMPUTE: boolean;
    CUSTOM_FIELD_DEBOUNCE: number;
    FIELD_BLUR_DEBOUNCE: number;
}

const INITIAL_CONFIG: IConfig = {
    WITH_DIRTY_CLICK_LISTENER: true,
    WITH_MOBILE_READONLY_FALLBACK: true,
    WITH_WAIT_FOR_MOVE_LISTENER: true,
    WITH_WAIT_FOR_TAB_LISTENER: true,
    WITH_WAIT_FOR_TOUCH_LISTENER: true,
    WITH_DISMOUNT_LISTENER: true,
    WITH_SYNC_COMPUTE: false,
    CUSTOM_FIELD_DEBOUNCE: FIELD_DEBOUNCE,
    FIELD_BLUR_DEBOUNCE: BLUR_DEBOUNCE,
};

export class OneConfigInstance {
    private _config: IConfig = INITIAL_CONFIG;
    getRef = () => this._config;
    setValue = (config: Partial<IConfig>) => {
        Object.assign(this._config, INITIAL_CONFIG, config);
    };
};

export default OneConfigInstance;
