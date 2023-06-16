import { useState, useEffect } from 'react';

import { MemoryHistory, BrowserHistory, HashHistory } from 'history';

import useActualCallback from '../../../hooks/useActualCallback';
import useActualValue from '../../../hooks/useActualValue';

const LEAVE_MESSAGE = 'The form contains unsaved changes. Continue?';

interface IParams {
    history: MemoryHistory | BrowserHistory | HashHistory;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    check?: () => boolean;
}

export const usePreventNavigate = ({
    history,
    check = () => false,
    onLoadStart,
    onLoadEnd,
}: IParams) => {

    const [loading, setLoading] = useState(0);

    const check$ = useActualCallback(check);
    const loading$ = useActualValue(loading);

    useEffect(() => history.block(
        ({ retry }) => {
            if (!check$() && !loading$.current) {
                retry();
            }
        }
    ), []);

    useEffect(() => {
        const handler = (e: any) => {
            if (check$() || loading$.current) {
                e.preventDefault();
                return LEAVE_MESSAGE;
            }
            return false;
        };
        window.onbeforeunload = handler;
        return () => {
            window.onbeforeunload = null;
        };
    }, []);

    return {
        handleLoadStart: () => {
            onLoadStart && onLoadStart();
            setLoading((loading) => loading + 1);
        },
        handleLoadEnd: (isOk: boolean) => {
            onLoadEnd && onLoadEnd(isOk);
            setLoading((loading) => loading - 1);
        },
    };
};

export default usePreventNavigate;
