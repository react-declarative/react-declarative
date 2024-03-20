import createValueProvider from "../../../utils/createValueProvider";
import { IConfig } from '../components/OneConfig';

const [DebounceProvider, useDebounceValue] = createValueProvider<number>();

/**
 * Returns the debounce config to be used.
 *
 * @param config - The config object with CUSTOM_FIELD_DEBOUNCE property.
 * @returns - The debounce config to be used.
 */
export const useDebounceConfig = (config: IConfig) => {
    const debounceContext = useDebounceValue();
    const debounceConfig = config.CUSTOM_FIELD_DEBOUNCE;
    return debounceContext || debounceConfig;
}

export { DebounceProvider };

export default DebounceProvider;
