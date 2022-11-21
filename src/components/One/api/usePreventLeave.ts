import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { BrowserHistory, MemoryHistory, HashHistory } from "history";

import createWindowHistory from '../../../utils/createWindowHistory';

import useConfirm from '../../../hooks/useConfirm';

import IOneProps from "../../../model/IOneProps";
import IAnything from "../../../model/IAnything";

export interface IPreventLeaveParams<Data = IAnything> {
    history?: BrowserHistory | MemoryHistory | HashHistory;
    initialData?: Data | null;
    onChange?: IOneProps<Data>['change'];
    onBlock?: () => (() => void) | void;
    onSave?: (data: Data) => void | (Promise<void>);
    fallback?: (e: Error) => void;
}

export interface IPreventLeaveReturn<Data = IAnything> {
    oneProps: {
        change: (data: Data, initial?: boolean) => void;
        invalidity: IOneProps<Data>['invalidity'];
    };
    data: Data | null;
    beginSave: () => Promise<boolean>;
    afterSave: () => void;
}

const LEAVE_MESSAGE = 'The form contains unsaved changes. Continue?';
const DEFAULT_HISTORY = createWindowHistory();

export const usePreventLeave = <Data = IAnything>({
    history = DEFAULT_HISTORY,
    initialData = null,
    onChange,
    onBlock = () => () => null,
    onSave = () => {},
    fallback,
}: IPreventLeaveParams<Data> = {}): IPreventLeaveReturn<Data> => {

    const [data, setData] = useState<Data | null>(initialData);
    const [invalid, setInvalid] = useState(false);

    const unsubscribeRef = useRef<Function | null>();

    const pickConfirm = useConfirm({
        title: 'Continue?',
        msg: LEAVE_MESSAGE,
    });

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useEffect(() => {

        const handleNavigate = (retry: () => void) =>
            pickConfirm().then((result) => {
                if (result) {
                    unsubscribe();
                    retry();
                }
            });

        const createRouterSubject = () => history.block(
            ({ retry }) => handleNavigate(retry)
        );

        const createLayoutSubject = () => {
            const dispose = onBlock && onBlock();
            return () => dispose && dispose();
        };

        const createUnloadSubject = () => {
            const handler = (e: any) => {
                e.preventDefault();
                return LEAVE_MESSAGE;
            };
            window.onbeforeunload = handler;
            return () => {
                window.onbeforeunload = null;
            };
        };

        let unsubscribeRouter: ReturnType<typeof createRouterSubject>;
        let unsubscribeLayout: ReturnType<typeof createLayoutSubject>;
        let unsubscribeUnload: ReturnType<typeof createUnloadSubject>;

        const unsubscribe = () => {
            unsubscribeRouter && unsubscribeRouter();
            unsubscribeLayout && unsubscribeLayout();
            unsubscribeUnload && unsubscribeUnload();
            unsubscribeRef.current = null;
        };

        const subscribe = () => {
            unsubscribeRouter = createRouterSubject();
            unsubscribeLayout = createLayoutSubject();
            unsubscribeUnload = createUnloadSubject();
            unsubscribeRef.current = unsubscribe;
        };

        if (!!data || invalid) {
            subscribe();
        }

        return unsubscribe;
    }, [data, invalid]);

    const handleChange = (data: Data, initial = false) => {
        if (!initial) {
            isMounted.current && setData(data);
            isMounted.current && setInvalid(false);
        }
        onChange && onChange(data, initial);
    };

    const handleInvalid = () => {
        setInvalid(true);
    };

    const afterSave = () => {
        isMounted.current && setData(null);
        isMounted.current && setInvalid(false);
    };

    const beginSave = async () => {
        if (data) {
            try {
                await Promise.resolve(onSave(data));
                afterSave();
                return true;
            } catch (e) {
                unsubscribeRef.current && unsubscribeRef.current();
                if (fallback) {
                    fallback(e as Error);
                } else {
                    throw e;
                }
            }
            return false;
        } else {
            return false;
        }
    };

    return {
        beginSave,
        afterSave,
        oneProps: {
            change: handleChange,
            invalidity: handleInvalid,
        },
        data : invalid ? null : data,
    };
};

export default usePreventLeave;
