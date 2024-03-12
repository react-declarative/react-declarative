import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { LoaderPlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';
import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

type Result = React.ReactNode | void;

type ObjectState<P extends any = object, A = any> = ((payload: P) => Promise<A>)
    | ((payload: P) => A);

type TupleState<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any>  = 
    ((payload: P) => readonly [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?, Promise<F>?, Promise<G>?, Promise<H>?, Promise<I>?, Promise<J>?])
        | ((payload: P) => readonly [A?, B?, C?, D?, E?, F?, G?, H?, I?, J?])
        | ((payload: P) => [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?, Promise<F>?, Promise<G>?, Promise<H>?, Promise<I>?, Promise<J>?])
        | ((payload: P) => [A?, B?, C?, D?, E?, F?, G?, H?, I?, J?]);

export interface IFetchViewBaseProps<
    P extends any = object, 
    A = any,
    B = any,
    C = any,
    D = any,
    E = any,
    F = any,
    G = any,
    H = any,
    I = any,
    J = any
> extends Omit<IAsyncProps<P>, keyof {
    children: never;
}> {
    animation?: IRevealProps['animation'];
    className?: string;
    style?: React.CSSProperties;
    children: (a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J) => Promise<Result> | Result;
};

export type IFetchViewObjectProps<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> = 
    IFetchViewBaseProps<P, A, B, C, D, E, F, G, H, I, J>
    & {
        state: ObjectState<P, A>;
    };

export type IFetchViewTupleProps<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> = 
    IFetchViewBaseProps<P, A, B, C, D, E, F, G, H, I, J>
    & {
        state: TupleState<P, A, B, C, D, E, F, G, H, I, J>;
    };

export type IFetchViewProps<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> =
    IFetchViewTupleProps<P, A, B, C, D, E, F, G, H, I, J>
        | IFetchViewObjectProps<P, A, B, C, D, E, F, G, H, I, J>;

const useStyles = makeStyles()({
    root: {
        width: '100%',
    },
});

/**
 * FetchView is a React component that provides a convenient way to handle asynchronous data fetching and rendering.
 *
 * @template P - The type of the payload for the data fetching.
 * @template A - The type of the first element in the array of data returned by the state function.
 * @template B - The type of the second element in the array of data returned by the state function.
 * @template C - The type of the third element in the array of data returned by the state function.
 * @template D - The type of the fourth element in the array of data returned by the state function.
 * @template E - The type of the fifth element in the array of data returned by the state function.
 * @template F - The type of the sixth element in the array of data returned by the state function.
 * @template G - The type of the seventh element in the array of data returned by the state function.
 * @template H - The type of the eighth element in the array of data returned by the state function.
 * @template I - The type of the ninth element in the array of data returned by the state function.
 * @template J - The type of the tenth element in the array of data returned by the state function.
 *
 * @param props - The props object containing the following properties:
 *  - animation: The animation type for the component.
 *  - className: The CSS class name(s) for the component.
 *  - style: The inline style object for the component.
 *  - Loader: The component to render while data is being fetched.
 *  - Error: The component to render if an error occurs during data fetching.
 *  - onLoadEnd: A callback function to be called when data loading ends.
 *  - onLoadStart: A callback function to be called when data loading starts.
 *  - children: A function that receives the fetched data as arguments and returns the JSX to be rendered.
 *  - state: The function to transform the payload into an array of data.
 *  - payload: The payload for the data fetching.
 *  - otherProps: Any additional props to be passed to the underlying components.
 *
 * @returns - The rendered JSX for the FetchView component.
 */
export const FetchView = <P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> ({
    animation,
    className,
    style,
    Loader = LoaderPlaceholder,
    Error = ErrorPlaceholder,
    onLoadEnd,
    onLoadStart,
    children,
    state,
    payload,
    ...otherProps
}: IFetchViewProps<P, A, B, C, D, E, F, G, H, I, J>) => {

    const { classes } = useStyles();

    const [appear, setAppear] = useState(false);

    const handleData = async (payload: P): Promise<[A, B, C, D, E, F, G, H, I, J]>  => {
        if (typeof state === 'function') {
            const result = state(payload);
            if (Array.isArray(result)) {
                return await Promise.all(result) as unknown as [A, B, C, D, E, F, G, H, I, J];
            } else {
                return [await result] as unknown as [A, B, C, D, E, F, G, H, I, J];
            }
        } else {
            return [] as unknown as [A, B, C, D, E, F, G, H, I, J];
        }
    };

    const handleLoadStart = () => {
        onLoadStart && onLoadStart();
        setAppear(false);
    };

    const handleLoadEnd = (isOk: boolean) => {
        onLoadEnd && onLoadEnd(isOk);
        setAppear(true);
    };

    return (
        <Reveal
            className={classNames(className, classes.root)}
            style={style}
            animation={animation}
            appear={appear}
        >
            <Async<P>
                {...otherProps}
                Loader={Loader}
                Error={Error}
                onLoadStart={handleLoadStart}
                onLoadEnd={handleLoadEnd}
                payload={payload}
            >
                {async (payload) => {
                    const data = await handleData(payload);
                    return children(...data);
                }}
            </Async>
        </Reveal>
    );
};

/*const state = () => [
    Promise.resolve('string'),
    Promise.resolve(1),
    Promise.resolve(true),
] as const;

const test = (
    <FetchView state={state}>
    {(str, num, bool) => (
        <></>
    )}
    </FetchView>
);*/

export default FetchView;
