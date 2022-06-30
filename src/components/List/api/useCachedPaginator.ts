import { useMemo } from 'react';
import singleshot from '../../../utils/hof/singleshot';

import useArrayPaginator from "./useArrayPaginator"

export const useCachedPaginator: typeof useArrayPaginator = (handler, params) => {
    const rowsHandler = useMemo(() => singleshot((...args: any[]) => {
        if (typeof handler === 'function') {
            return (handler as Function)(...args);
        } else {
            return handler;
        }
    }), []);
    return useArrayPaginator(rowsHandler, params);
};

export default useCachedPaginator;
