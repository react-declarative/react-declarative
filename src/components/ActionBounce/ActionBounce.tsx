import * as React from 'react';

import { useEffect, useMemo } from "react";

import { makeStyles, keyframes } from "../../styles";

import PaperView, { IPaperViewProps } from "../PaperView";

import useActualState from '../../hooks/useActualState';

import TSubject from '../../model/TSubject';
import ActionState from './model/ActionState';

import classNames from "../../utils/classNames";

interface IActionBounceProps extends Omit<IPaperViewProps, keyof {
    onAnimationEnd: never;
    onAnimationStart: never;
}> {
    onAnimationStart?: (state: ActionState, e: React.AnimationEvent<HTMLDivElement>) => void;
    onAnimationEnd?: (state: ActionState, e: React.AnimationEvent<HTMLDivElement>) => void;
    defaultState?: ActionState;
    stateSubject: TSubject<ActionState>;
}

const useStyles = makeStyles()((theme) => {

    const activeAnimation = keyframes`
        0% {
            transform: scale(1,1);
        }
        100% {
            transform: scale(0.9, 1.1) translateY(-200px);
        }
    `;

    const abortAnimation = keyframes`
        0% {
            transform: scale(1.05, 0.95) translateY(0);
        }
        10% {
            transform: scale(1.05, 0.95) translateY(0);
        }
        20% {
            transform: scale(1,1) translateY(-7px);
        }
        30% {
            transform: scale(1,1) translateY(0);
        }
        40% {
            transform: scale(1.05, 0.95) translateY(0);
        }
        50% {
            transform: scale(1,1) translateY(-7px);
        }
        60% {
            transform: scale(1,1) translateY(0);
        }
        70% {
            transform: scale(1.05, 0.95) translateY(0);
        }
        80% {
            transform: scale(1,1) translateY(-7px);
        }
        90% {
            transform: scale(1,1) translateY(0);
        }
        100% {
            transform: scale(1,1) translateY(0);
        }
    `;

    const succeedAnimation = keyframes`
        0% {
            opacity: 1;
            transform: scale(0.9, 1.1) translateY(-200px);
        }
        100% {
            opacity: 0;
            transform: scale(0.9, 1.1) translateY(-400px);
        }
    `;

    return {
        initial: {},
        succeed: {
          animation: `${succeedAnimation} 500ms ${theme.transitions.easing.easeInOut}`,
          transform: 'scale(0.9, 1.1) translateY(-400px)',
          opacity: 0,
        },
        active: {
          animation: `${activeAnimation} 5s ${theme.transitions.easing.easeInOut}`,
          transform: 'scale(0.9, 1.1) translateY(-200px)',
        },
        abort: {
          animation: `${abortAnimation} 500ms ${theme.transitions.easing.easeInOut}`,
        },
        closed: {
            visibility: 'hidden',
        },
    };
});

export const ActionBounce = ({
    defaultState = ActionState.Initial,
    onAnimationEnd,
    onAnimationStart,
    className,
    children,
    stateSubject,
    ...otherProps
}: IActionBounceProps) => {

    const { classes } = useStyles();

    const classMap = useMemo(() => ({
        [ActionState.Initial]: classes.initial,
        [ActionState.Active]: classes.active,
        [ActionState.Abort]: classes.abort,
        [ActionState.Succeed]: classes.succeed,
        [ActionState.Closed]: classes.closed,
    }), []);

    const [animation$, setAnimation] = useActualState(defaultState);

    useEffect(() => stateSubject.subscribe((state) => setAnimation(state)), []);

    const animationClass = useMemo(() => classMap[animation$.current], [animation$.current]);

    return (
        <PaperView
            className={classNames(className, animationClass)}
            onAnimationEnd={(e) => {
                onAnimationEnd && onAnimationEnd(animation$.current, e);
            }}
            onAnimationStart={(e) => {
                onAnimationStart && onAnimationStart(animation$.current, e);
            }}
            {...otherProps}
        >
            {children}
        </PaperView>
    );
};

export default ActionBounce;
