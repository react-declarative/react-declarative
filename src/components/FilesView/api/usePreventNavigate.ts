import { useEffect } from 'react';

import { MemoryHistory, BrowserHistory, HashHistory } from 'history';

const LEAVE_MESSAGE = 'The form contains unsaved changes. Continue?';

interface IParams {
    history: MemoryHistory | BrowserHistory | HashHistory;
    check: () => boolean;
}

export const usePreventNavigate = ({
    history,
    check,
}: IParams) => {
    useEffect(() => history.block(
        ({ retry }) => {
            if (!check()) {
                retry();
            }
        }
    ), []);
    useEffect(() => {
        const handler = (e: any) => {
            if (check()) {
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
};

export default usePreventNavigate;
