import { useState, useEffect } from 'react';

import { MemoryHistory, BrowserHistory, HashHistory } from 'history';

import useConfirm from '../../../hooks/useConfirm';

import compose from '../../../utils/compose';

const LEAVE_MESSAGE = 'The form contains unsaved changes. Continue?';

interface IParams {
    history: MemoryHistory | BrowserHistory | HashHistory;
    withConfirm?: boolean;
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
}

export const usePreventNavigate = ({
    history,
    withConfirm = false,
    onLoadStart,
    onLoadEnd,
}: IParams) => {

    const [loading, setLoading] = useState(0);

    const pickConfirm = useConfirm({
        title: 'Continue?',
        msg: LEAVE_MESSAGE,
    });

    useEffect(() => {

        let unsubscribeRef = () => undefined;

        const handleNavigate = (retry: () => void) => {
            if (withConfirm) {
                pickConfirm().then((result) => {
                    if (result) {
                        unsubscribeRef();
                        retry();
                    }
                });
            }
        };

        const createRouterBlocker = () => history.block(
            ({ retry }) => handleNavigate(retry)
        );

        const createUnloadBlocker = () => {
            const handler = (e: any) => {
                e.preventDefault();
                return LEAVE_MESSAGE;
            };
            window.onbeforeunload = handler;
            return () => {
                window.onbeforeunload = null;
            };
        };

        if (loading) {
            unsubscribeRef = compose(
                createRouterBlocker(),
                createUnloadBlocker(),
            );
        }
        return unsubscribeRef;
    }, [loading, withConfirm]);

    return {
        handleLoadStart: () => {
            onLoadStart && onLoadStart();
            setLoading((loading) => loading + 1);
        },
        handleLoadEnd: (isOk: boolean) => {
            onLoadEnd && onLoadEnd(isOk);
            setLoading((loading) => loading - 1);
        },
        loading: !!loading,
    };
};

export default usePreventNavigate;
