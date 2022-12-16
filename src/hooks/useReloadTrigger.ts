import { useState, useEffect, useCallback } from 'react';

import randomString from "../utils/randomString";

const INITIAL_VALUE = randomString();

export const useReloadTrigger = (autoReload = 0) => {
    const [reloadTrigger, setReloadValue] = useState(INITIAL_VALUE);
    const doReload = useCallback(() => setReloadValue(randomString()), []);
    useEffect(() => {
        let timeout: any;
        if (autoReload) {
            timeout = setTimeout(() => {
                timeout = undefined;
                doReload();
            }, autoReload);
        }
        return () => {
            if (timeout !== undefined) {
                clearTimeout(timeout);
            }
        };
    }, [reloadTrigger, autoReload, doReload]);
    return {
        reloadTrigger,
        doReload,
    };
};

export default useReloadTrigger;
