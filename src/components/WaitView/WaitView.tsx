import * as React from 'react';
import { useState } from 'react';

import Async, { IAsyncProps } from '../Async';

interface IWaitViewProps extends Omit<IAsyncProps, keyof {
    payload: never;
    children: never;
}> {
    Content: React.ComponentType<any>;
    condition: () => Promise<boolean> | boolean;
    onDone?: (attempts: number) => void;
    delay?: number;
};

const Fragment = () => <></>;

export const WaitView = ({
    onDone,
    condition,
    Loader = Fragment,
    Content = Fragment,
    delay = 1_000,
    ...otherProps
}: IWaitViewProps) => {
    const [attempt, setAttempt] = useState(0);
    const handleDelay = () => setTimeout(() => setAttempt((attempt) => attempt + 1), delay);
    return (
        <Async {...otherProps} payload={attempt} Loader={Loader}>
            {async (attempt) => {
                const result = await condition();
                if (result) {
                    onDone && onDone(attempt);
                    return <Content />;
                } else {
                    handleDelay();
                    return <Loader />;
                }
            }}
        </Async>
    );
};

export default WaitView
