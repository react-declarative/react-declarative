import * as React from 'react';
import { useState, useEffect } from 'react';

import Async, { IAsyncProps } from '../Async';

/**
 * Interface representing the props for the WaitView component.
 *
 * @template P - The type of additional props for the Content component.
 * @template T - The type of the condition result.
 */
interface IWaitViewProps<P extends any = object, T extends any = object> extends Omit<IAsyncProps<P>, keyof {
    children: never;
}> {
    Content: React.ComponentType<any>;
    condition: () => (Promise<boolean> | boolean | Promise<T> | T | Promise<null> | null);
    conditionMap?: (result: T) => boolean;
    onDone?: (attempts: number) => void;
    totalAttempts?: number;
    delay?: number;
};

/**
 * Represents a state for a specific application.
 *
 * @template T - The type of payload that the state holds, defaults to object.
 */
interface IState<T extends any = object> {
    payload: T | undefined;
    attempt: number;
    initComplete: boolean
}

const Fragment = () => <></>;

/**
 * Renders a component with loading, content, and error states based on a condition.
 *
 * @template P - The type of the payload.
 * @template T - The type of the condition result.
 *
 * @param props - The component props.
 * @param props.onDone - A callback function to be executed when the condition is met.
 * @param props.condition - A function that returns a condition.
 * @param [props.Loader=Fragment] - The loading component.
 * @param [props.Content=Fragment] - The content component.
 * @param [props.Error=Fragment] - The error component.
 * @param [props.delay=1000] - The delay in milliseconds before retrying the condition.
 * @param [props.totalAttempts=Infinity] - The maximum number of attempts before showing the error state.
 * @param [props.conditionMap=(result) => !!result] - A function to map the condition result to a boolean value.
 * @param props.payload - The payload to be passed to the components.
 * @param otherProps - Other props to be passed to the Async component.
 *
 * @returns The rendered component.
 */
export const WaitView = <P extends any = object, T extends any = object>({
    onDone,
    condition,
    Loader = Fragment,
    Content = Fragment,
    Error = Fragment,
    delay = 1_000,
    totalAttempts = Number.POSITIVE_INFINITY,
    conditionMap = (result) => !!result,
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
                    const params = {
                        condition: result,
                        attempt,
                        payload,
                    };
                    if (conditionMap(result as unknown as T)) {
                        onDone && onDone(attempt);
                        return <Content {...params} />;
                    } else if (attempt > totalAttempts) {
                        return <Error {...params} />;
                    } else {
                        handleDelay();
                        return <Loader {...params} />;
                    }
                }}
            </Async>
        );
    } else {
        return null;
    }
};

export default WaitView;
