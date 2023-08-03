import { useState, useRef, useEffect, useLayoutEffect } from 'react';

import { BrowserHistory, MemoryHistory, HashHistory } from "history";

import createWindowHistory from '../../../utils/createWindowHistory';
import sleep from '../../../utils/sleep';

import useConfirm from '../../../hooks/useConfirm';
import useRenderWaiter from '../../../hooks/useRenderWaiter';
import useSubject from '../../../hooks/useSubject';

import useActualCallback from '../../../hooks/useActualCallback';
import useActualValue from '../../../hooks/useActualValue';

import IOneProps from "../../../model/IOneProps";
import IAnything from "../../../model/IAnything";
import TSubject from '../../../model/TSubject';

export interface IPreventLeaveParams<Data = IAnything, ID = string> {
    history?: BrowserHistory | MemoryHistory | HashHistory;
    waitForChangesDelay?: number;
    readonly?: boolean;
    updateSubject?: TSubject<[ID, Data]>;
    changeSubject?: TSubject<Data>;
    checkUpdate?: (id: ID, data: Data) => boolean;
    onChange?: IOneProps<Data>['change'];
    onBlock?: () => (() => void) | void;
    onUpdate?: (id: ID, data: Data) => void;
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
        changeSubject: IOneProps<Data>['changeSubject'];
        fallback?: (e: Error) => void;
    };
    data: Data | null;
    hasChanged: boolean;
    hasLoading: boolean;
    beginSave: () => Promise<boolean>;
    afterSave: () => void;
    dropChanges: () => void;
    waitForChanges: () => Promise<void>;
}

const LEAVE_MESSAGE = 'The form contains unsaved changes. Continue?';
const INVALID_MESSAGE = 'The form contains invalid data. Continue?';
const DEFAULT_HISTORY = createWindowHistory();
const WAIT_FOR_CHANGES_DELAY = 1_000;

export const usePreventLeave = <Data = IAnything, ID = string>({
    history = DEFAULT_HISTORY,
    waitForChangesDelay = WAIT_FOR_CHANGES_DELAY,
    readonly: upperReadonly = false,
    onChange,
    onLoadStart,
    onLoadEnd,
    onBlock = () => () => null,
    onSave = () => true,
    onUpdate = () => null,
    checkUpdate = () => true,
    fallback,
    updateSubject: upperUpdateSubject,
    changeSubject: upperChangeSubject,
}: IPreventLeaveParams<Data, ID> = {}): IPreventLeaveReturn<Data> => {

    const updateSubject = useSubject(upperUpdateSubject);

    const changeSubject = useSubject<Data>(upperChangeSubject);

    const [data, setData] = useState<Data | null>(null);
    const [invalid, setInvalid] = useState(false);
    const [loading, setLoading] = useState(0);
    const [readonly, setReadonly] = useState(false);

    const initialDataRef = useRef<Data | null>(data);

    const hasChanged = !!data && !loading;
    const hasLoading = !!loading;

    const onUpdate$ = useActualCallback(onUpdate);

    const hasChanged$ = useActualValue(hasChanged);
    const data$ = useActualValue(data);

    useEffect(() => updateSubject.subscribe(([id, change]) => {
        if (!checkUpdate(id, change)) {
            return;
        }
        changeSubject.next(change);
        if (hasChanged$.current) {
            setData(change);
        }
        onUpdate$(id, change);
    }), []);

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
            pickConfirm({
                msg: invalid ? INVALID_MESSAGE : LEAVE_MESSAGE,
            }).then((result) => {
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
        if (initial) {
            initialDataRef.current = data;
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
        if (!hasChanged$.current) {
            return false;
        }
        await waitForChanges();
        const { current: data } = data$;
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

    const dropChanges = () => {
        const { current: lastData } = initialDataRef;
        lastData && changeSubject.next(lastData);
        setData(null);
        setInvalid(false);
    };

    const waitForChanges = async () => {
        const unblock = history.block(() => { });
        setReadonly(true);
        try {
            await Promise.race([
                waitForRender(),
                sleep(waitForChangesDelay),
            ]);
        } finally {
            setReadonly(false);
            unblock();
        }
    };

    return {
        beginSave,
        afterSave,
        dropChanges,
        waitForChanges,
        oneProps: {
            change: handleChange,
            invalidity: handleInvalid,
            readonly: !!loading || readonly || upperReadonly,
            ...fallback && { fallback },
            changeSubject,
        },
        data : invalid ? null : data,
        hasChanged,
        hasLoading,
    };
};

export default usePreventLeave;
