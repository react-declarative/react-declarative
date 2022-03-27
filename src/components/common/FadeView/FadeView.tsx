import * as React from 'react';

import FadeContainer, { IFadeContainerProps } from './components/FadeContainer';
import ScrollView from '../ScrollView';
import AutoSizer from '../AutoSizer';

type FadeContainerT = Pick<IFadeContainerProps, keyof {
    Fade: never;
    color: never;
    zIndex: never;
    disableBottom: never;
    disableRight: never;
}>;

interface IFadeView extends FadeContainerT {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactChild;
}

export const FadeView = ({
    className,
    style,
    children,
    Fade,
    color,
    zIndex,
    disableBottom,
    disableRight,
}: IFadeView) => {
    return (
        <div className={className} style={style}>
            <AutoSizer>
                {({ height, width }) => (
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
