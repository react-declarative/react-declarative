import * as React from 'react';
import { useState, useEffect, useLayoutEffect, useRef } from 'react';

import { makeStyles } from '../../styles';

import Reveal, { IRevealProps } from '../FetchView/components/Reveal';

import classNames from '../../utils/classNames';
import sleep from '../../utils/sleep';

interface IRevealViewProps {
    className?: string;
    style?: React.CSSProperties;
    animation?: IRevealProps['animation'];
    delay?: number;
    appear?: boolean;
    children: React.ReactNode;
}

const REVEAL_DELAY = 0;

const useStyles = makeStyles()({
    root: {
        width: '100%',
    },
});

export const RevealView = ({
    children,
    className,
    style,
    animation,
    delay = REVEAL_DELAY,
    appear: upperAppear = true,
}: IRevealViewProps) => {

    const { classes } = useStyles();

    const [appear, setAppear] = useState(false);

    const isMounted = useRef(true);

    useLayoutEffect(() => () => {
      isMounted.current = false;
    }, []);

    useEffect(() => {
        upperAppear && sleep(delay).then(() => {
            if (isMounted.current) {
                setAppear(true);
            }
        });
    }, [upperAppear]);

    return (
        <Reveal 
            className={classNames(className, classes.root)}
            style={style}
            animation={animation}
            appear={appear}
        >
            {appear && (
                <>
                    {children}
                </>
            )}
        </Reveal>
    );

};

export default RevealView;
