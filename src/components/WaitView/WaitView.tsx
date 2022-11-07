import * as React from 'react';
import { useState, useEffect } from 'react';

import Async, { IAsyncProps } from '../Async';

interface IWaitViewProps<P extends any = object, T extends any = object> extends Omit<IAsyncProps<P>, keyof {
    children: never;
}> {
    Content: React.ComponentType<any>;
    condition: () => Promise<boolean> | boolean | Promise<T> | T;
    onDone?: (attempts: number) => void;
    totalAttempts?: number;
    delay?: number;
};

interface IState<T extends any = object> {
    payload: T | undefined;
    attempt: number;
    initComplete: boolean
}

const Fragment = () => <></>;

export const WaitView = <P extends any = object, T extends any = object>({
    onDone,
    condition,
    Loader = Fragment,
    Content = Fragment,
    Error = Fragment,
    delay = 1_000,
    totalAttempts = Number.POSITIVE_INFINITY,
    payload,
    ...otherProps
}: IWaitViewProps<P, T>) => {

    const [state, setState] = useState<IState<P>>({
        payload,
        attempt: 0,
        initComplete: false,
    })

    useEffect(() => setState({
        payload,
        attempt: 0,
        initComplete: true,
    }), [payload]);

    const handleDelay = () => setTimeout(() => setState((prevState) => ({
        ...prevState,
        attempt: prevState.attempt + 1,
    })), delay);

    if (state.initComplete) {
        return (
            <Async {...otherProps} payload={state} Loader={Loader}>
                {async ({ payload, attempt }) => {
                    const result = await condition();
                    if (result) {
                        onDone && onDone(attempt);
                        return <Content payload={payload} condition={result} />;
                    } else if (attempt > totalAttempts) {
                        return <Error payload={payload} />;
                    } else {
                        handleDelay();
                        return <Loader payload={payload} />;
                    }
                }}
            </Async>
        );
    } else {
        return null;
    }
};

export default WaitView
