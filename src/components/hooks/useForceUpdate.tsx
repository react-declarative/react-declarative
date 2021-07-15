import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
    const [, forceUpdate] = useState(false);
    return useCallback(() => {
        forceUpdate((s) => !s);
    }, []);
};

export default useForceUpdate;
