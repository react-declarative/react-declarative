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

/**
 * Render a RevealView component that animates the appearance of its children.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} props.children - The children to be revealed.
 * @param {string} [props.className] - The additional CSS class names for the component.
 * @param {object} [props.style] - The inline CSS styles for the component.
 * @param {Animation} [props.animation] - The animation to use for revealing the children.
 * @param {number} [props.delay=REVEAL_DELAY] - The delay in milliseconds before the children start to appear.
 * @param {boolean} [props.appear=true] - Determines whether the children should appear.
 */
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
