import * as React from 'react';

import FadeContainer, { IFadeContainerProps } from './components/FadeContainer';

import ScrollView from '../ScrollView';
import AutoSizer, { IAutoSizerProps } from '../AutoSizer';

import IAnything from '../../model/IAnything';

type FadeContainerT = Pick<IFadeContainerProps, keyof {
    Fade: never;
    color: never;
    zIndex: never;
    disableBottom: never;
    disableRight: never;
}>;

interface IFadeView<T extends IAnything = IAnything> extends FadeContainerT {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactChild;
    payload?: IAutoSizerProps<T>["payload"];
    heightRequest?: IAutoSizerProps<T>["heightRequest"];
    widthRequest?: IAutoSizerProps<T>["widthRequest"];
}

export const FadeView = <T extends IAnything = IAnything>({
    className,
    style,
    children,
    Fade,
    color,
    zIndex,
    disableBottom,
    disableRight,
    payload,
    heightRequest,
    widthRequest,
}: IFadeView<T>) => {
    return (
        <div className={className} style={style}>
            <AutoSizer
                payload={payload}
                heightRequest={heightRequest}
                widthRequest={widthRequest}
            >
                {({ height, width, payload }) => (
                    <FadeContainer
                        Fade={Fade}
                        color={color}
                        zIndex={zIndex}
                        disableBottom={disableBottom}
                        disableRight={disableRight}
                    >
                        <ScrollView
                            style={{ 
                                height,
                                width,
                            }}
                            payload={payload}
                            heightRequest={heightRequest}
                            widthRequest={widthRequest}
                        >
                            {children}
                        </ScrollView>
                    </FadeContainer>
                )}
            </AutoSizer>
        </div>
    );
};

export default FadeView;
