import * as React from 'react';

import BottomFade, { IBottomFadeProps } from '../BottomFade';
import ScrollView from '../ScrollView';
import AutoSizer from '../AutoSizer';

type BottomFadeT = Pick<IBottomFadeProps, keyof {
    Fade: never;
    color: never;
    zIndex: never;
}>;

interface IFadeView extends BottomFadeT {
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
}: IFadeView) => {
    return (
        <div className={className} style={style}>
            <AutoSizer>
                {({ height, width }) => (
                    <BottomFade
                        Fade={Fade}
                        color={color}
                        zIndex={zIndex}
                    >
                        <ScrollView
                            style={{ 
                                height,
                                width,
                            }}
                        >
                            {children}
                        </ScrollView>
                    </BottomFade>
                )}
            </AutoSizer>
        </div>
    );
};

export default FadeView;
