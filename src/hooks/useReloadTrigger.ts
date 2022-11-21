import { useState } from 'react';

import randomString from "../utils/randomString";

const INITIAL_VALUE = randomString();

export const useReloadTrigger = () => {
    const [reloadTrigger, setReloadValue] = useState(INITIAL_VALUE);
    const doReload = () => setReloadValue(randomString());
    return {
        reloadTrigger,
        doReload,
    };
};

export default useReloadTrigger;
