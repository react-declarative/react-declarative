import * as React from 'react';
import { useState } from 'react';

import { makeStyles } from '../../styles';

import Async, { IAsyncProps } from '../Async';

import { Loaderlaceholder } from './components/Placeholder';
import { ErrorPlaceholder } from './components/Placeholder';
import Reveal, { IRevealProps } from './components/Reveal';

import classNames from '../../utils/classNames';

import IAnything from '../../model/IAnything';

type FetchState<T extends any = object> = ((payload: T) => Promise<IAnything>) | ((payload: T) => IAnything);

type State<P extends any = object> = {
    state: FetchState<P>;
    children: (data: IAnything) => React.ReactNode;
} | {
    state: FetchState<P>[];
    children: (data: IAnything[]) => React.ReactNode;
};

export type IFetchViewProps<P extends any = object> = Omit<IAsyncProps<P>, keyof {
    children: never;
}> & State<P> & {
    animation?: IRevealProps['animation'];
    className?: string;
    style?: React.CSSProperties;
};

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
});

export const FetchView = <P extends any = object> ({
    animation,
    className,
    style,
    Loader = Loaderlaceholder,
    Error = ErrorPlaceholder,
    onLoadEnd,
    onLoadStart,
    children,
    state,
    payload,
    ...otherProps
}: IFetchViewProps<P>) => {

    const classes = useStyles();

    const [appear, setAppear] = useState(false);

    const handleData = async (payload: P): Promise<IAnything>  => {
        if (Array.isArray(state)) {
            const result: IAnything[] = [];
            for (const item of state) {
                result.push(await item(payload));
            }
            return result;
        } else {
            return await state(payload);
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
                    return children(data);
                }}
            </Async>
        </Reveal>
    );
};

export default FetchView;
