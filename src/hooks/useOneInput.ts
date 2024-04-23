import { useEffect } from "react";
import IAnything from "../model/IAnything";
import useReloadTrigger from "./useReloadTrigger";
import useChangeSubject from "./useChangeSubject";

interface IParams<T extends IAnything = IAnything> {
    onValueChange: (value: T) => void;
    readonly: boolean;
    value: T;
}

export const useOneInput = <T extends IAnything = IAnything>({
    readonly,
    value: upperValue,
    onValueChange,
}: IParams<T>) => {
    const { reloadTrigger, doReload } = useReloadTrigger();
    const readonlyChanged = useChangeSubject(readonly);
    useEffect(() => readonlyChanged.subscribe(doReload), []);
    return {
        key: reloadTrigger,
        readOnly: readonly,
        value: readonly ? upperValue : undefined,
        defaultValue: upperValue,
        onBlur: (e: any) => {
            onValueChange(e.target.value);
        },
    }
}

export default useOneInput;
