import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { BrowserHistory, MemoryHistory, HashHistory } from "history";

import createWindowHistory from '../../../utils/createWindowHistory';

import useConfirm from '../../../hooks/useConfirm';
import useRenderWaiter from '../../../hooks/useRenderWaiter';
import useSubject from '../../../hooks/useSubject';

import IOneProps from "../../../model/IOneProps";
import IAnything from "../../../model/IAnything";

export interface IPreventLeaveParams<Data = IAnything> {
    history?: BrowserHistory | MemoryHistory | HashHistory;
    onChange?: IOneProps<Data>['change'];
    onBlock?: () => (() => void) | void;
    onSave?: (data: Data) => (boolean | Promise<boolean>);
    onLoadStart?: () => void;
    onLoadEnd?: (isOk: boolean) => void;
    fallback?: (e: Error) => void;
}

export interface IPreventLeaveReturn<Data = IAnything> {
    oneProps: {
        change: (data: Data, initial?: boolean) => void;
        invalidity: IOneProps<Data>['invalidity'];
        readonly: IOneProps<Data>['readonly'];
        fallback?: (e: Error) => void;
    };
    data: Data | null;
    beginSave: () => Promise<boolean>;
    afterSave: () => void;
}

const LEAVE_MESSAGE = 'The form contains unsaved changes. Continue?';
const DEFAULT_HISTORY = createWindowHistory();

export const usePreventLeave = <Data = IAnything>({
    history = DEFAULT_HISTORY,
    onChange,
    onLoadStart,
    onLoadEnd,
    onBlock = () => () => null,
    onSave = () => true,
    fallback,
}: IPreventLeaveParams<Data> = {}): IPreventLeaveReturn<Data> => {

    const [data, setData] = useState<Data | null>(null);
    const [invalid, setInvalid] = useState(false);

    const [loading, setLoading] = useState(0);

    const handleLoadStart = () => {
        onLoadStart && onLoadStart();
        setLoading((loading) => loading + 1);
    };

    const handleLoadEnd = (isOk: boolean) => {
        onLoadEnd && onLoadEnd(isOk);
        setLoading((loading) => loading - 1);
    };

    const leaveSubject = useSubject<void>();

    useEffect(() => () => {
        leaveSubject.next();
    }, []);

    const unsubscribeRef = useRef<Function | null>();

    const waitForRender = useRenderWaiter([data, invalid], 500);

    const waitForLeave = () => leaveSubject.toPromise();

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

    const afterSave = async () => {
        if (isMounted.current) {
            setData(null);
            setInvalid(false);
            await Promise.race([
                waitForRender(),
                waitForLeave(),
            ]);
        }
    };

    const beginSave = async () => {
        if (data) {
            let isOk = true;
            handleLoadStart();
            try {
                const result = await Promise.resolve(onSave(data));
                if (result) {
                    await afterSave();
                }
                isOk = !!result;
            } catch (e) {
                isOk = false;
                unsubscribeRef.current && unsubscribeRef.current();
                if (fallback) {
                    fallback(e as Error);
                } else {
                    throw e;
                }
            } finally {
                handleLoadEnd(isOk);
            }
            return isOk;
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
            readonly: !!loading,
            ...fallback && { fallback },
        },
        data : invalid ? null : data,
    };
};

export default usePreventLeave;
