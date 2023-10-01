import createValueProvider from "../../../utils/createValueProvider";
import { IConfig } from '../components/OneConfig';

const [DebounceProvider, useDebounceValue] = createValueProvider<number>();

export const useDebounceConfig = (config: IConfig) => {
    const debounceContext = useDebounceValue();
    const debounceConfig = config.CUSTOM_FIELD_DEBOUNCE;
    return debounceContext || debounceConfig;
}

export { DebounceProvider };

export default DebounceProvider;
