import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { LoaderPlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';
import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

/**
 * Represents the possible types of the Result class.
 *
 * @typedef {React.ReactNode} ResultType
 * @typedef {void} VoidType
 */
type Result = React.ReactNode | void;

/**
 * Represents the state of an object with optional payload and result.
 *
 * @template P - The type of the payload.
 * @template A - The type of the result.
 */
type ObjectState<P extends any = object, A = any> = ((payload: P) => Promise<A>)
    | ((payload: P) => A);

/**
 * Represents a tuple state with optional promises in TypeScript.
 *
 * @template P - The type of the payload.
 * @template A - The type of the first element of the tuple.
 * @template B - The type of the second element of the tuple.
 * @template C - The type of the third element of the tuple.
 * @template D - The type of the fourth element of the tuple.
 * @template E - The type of the fifth element of the tuple.
 * @template F - The type of the sixth element of the tuple.
 * @template G - The type of the seventh element of the tuple.
 * @template H - The type of the eighth element of the tuple.
 * @template I - The type of the ninth element of the tuple.
 * @template J - The type of the tenth element of the tuple.
 */
type TupleState<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any>  =
    ((payload: P) => readonly [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?, Promise<F>?, Promise<G>?, Promise<H>?, Promise<I>?, Promise<J>?])
        | ((payload: P) => readonly [A?, B?, C?, D?, E?, F?, G?, H?, I?, J?])
        | ((payload: P) => [Promise<A>?, Promise<B>?, Promise<C>?, Promise<D>?, Promise<E>?, Promise<F>?, Promise<G>?, Promise<H>?, Promise<I>?, Promise<J>?])
        | ((payload: P) => [A?, B?, C?, D?, E?, F?, G?, H?, I?, J?]);

/**
 * Props interface for the IFetchViewBase component.
 *
 * @template P - Type of the component's props.
 * @template A - Type of parameter A.
 * @template B - Type of parameter B.
 * @template C - Type of parameter C.
 * @template D - Type of parameter D.
 * @template E - Type of parameter E.
 * @template F - Type of parameter F.
 * @template G - Type of parameter G.
 * @template H - Type of parameter H.
 * @template I - Type of parameter I.
 * @template J - Type of parameter J.
 */
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

/**
 * Represents the properties required to fetch view object.
 *
 * @template P - The type of the props object.
 * @template A - The type of the additional data.
 * @template B - The type of additional data B.
 * @template C - The type of additional data C.
 * @template D - The type of additional data D.
 * @template E - The type of additional data E.
 * @template F - The type of additional data F.
 * @template G - The type of additional data G.
 * @template H - The type of additional data H.
 * @template I - The type of additional data I.
 * @template J - The type of additional data J.
 */
export type IFetchViewObjectProps<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> =
    IFetchViewBaseProps<P, A, B, C, D, E, F, G, H, I, J>
    & {
        state: ObjectState<P, A>;
    };

/**
 * Represents the properties required by the `IFetchViewTuple` component.
 *
 * @template P - The type of the component's props.
 * @template A - The type of the first element in the tuple state.
 * @template B - The type of the second element in the tuple state.
 * @template C - The type of the third element in the tuple state.
 * @template D - The type of the fourth element in the tuple state.
 * @template E - The type of the fifth element in the tuple state.
 * @template F - The type of the sixth element in the tuple state.
 * @template G - The type of the seventh element in the tuple state.
 * @template H - The type of the eighth element in the tuple state.
 * @template I - The type of the ninth element in the tuple state.
 * @template J - The type of the tenth element in the tuple state.
 */
export type IFetchViewTupleProps<P extends any = object, A = any, B = any, C = any, D = any, E = any, F = any, G = any, H = any, I = any, J = any> =
    IFetchViewBaseProps<P, A, B, C, D, E, F, G, H, I, J>
    & {
        state: TupleState<P, A, B, C, D, E, F, G, H, I, J>;
    };

/**
 * @typedef {object} IFetchViewProps
 * @template P - The type parameter for the main component props
 * @template A - The type parameter for the first additional prop
 * @template B - The type parameter for the second additional prop
 * @template C - The type parameter for the third additional prop
 * @template D - The type parameter for the fourth additional prop
 * @template E - The type parameter for the fifth additional prop
 * @template F - The type parameter for the sixth additional prop
 * @template G - The type parameter for the seventh additional prop
 * @template H - The type parameter for the eighth additional prop
 * @template I - The type parameter for the ninth additional prop
 * @template J - The type parameter for the tenth additional prop
 *
 * Represents the props required for the FetchView component.
 * The props can be either in a tuple format or in an object format.
 */
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

    /**
     * Handle data with the given payload.
     *
     * @template P - The type of the payload.
     * @template A - The type of the first element in the resulting array.
     * @template B - The type of the second element in the resulting array.
     * @template C - The type of the third element in the resulting array.
     * @template D - The type of the fourth element in the resulting array.
     * @template E - The type of the fifth element in the resulting array.
     * @template F - The type of the sixth element in the resulting array.
     * @template G - The type of the seventh element in the resulting array.
     * @template H - The type of the eighth element in the resulting array.
     * @template I - The type of the ninth element in the resulting array.
     * @template J - The type of the tenth element in the resulting array.
     *
     * @param payload - The payload to handle.
     * @returns - A promise that resolves to an array containing ten elements of types [A, B, C, D, E, F, G, H, I, J].
     */
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

    /**
     * Handles the load start event.
     *
     * @function handleLoadStart
     * @inner
     *
     * @returns
     */
    const handleLoadStart = () => {
        onLoadStart && onLoadStart();
        setAppear(false);
    };

    /**
     * Handles the load end event.
     *
     * @param isOk - Indicates if the load was successful or not.
     * @returns
     */
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
