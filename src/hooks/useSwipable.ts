import * as React from "react";

export const LEFT = "Left";
export const RIGHT = "Right";
export const UP = "Up";
export const DOWN = "Down";
export type HandledEvents = React.MouseEvent | TouchEvent | MouseEvent;
export type Vector2 = [number, number];
export type SwipeDirections =
    | typeof LEFT
    | typeof RIGHT
    | typeof UP
    | typeof DOWN;
export interface SwipeEventData {
    /**
     * Absolute displacement of swipe in x. Math.abs(deltaX);
     */
    absX: number;
    /**
     * Absolute displacement of swipe in y. Math.abs(deltaY);
     */
    absY: number;
    /**
     * Displacement of swipe in x. (current.x - initial.x)
     */
    deltaX: number;
    /**
     * Displacement of swipe in y. (current.y - initial.y)
     */
    deltaY: number;
    /**
     * Direction of swipe - Left | Right | Up | Down
     */
    dir: SwipeDirections;
    /**
     * Source event.
     */
    event: HandledEvents;
    /**
     * True for the first event of a tracked swipe.
     */
    first: boolean;
    /**
     * Location where swipe started - [x, y].
     */
    initial: Vector2;
    /**
     * "Absolute velocity" (speed) - √(absX^2 + absY^2) / time
     */
    velocity: number;
    /**
     * Velocity per axis - [ deltaX/time, deltaY/time ]
     */
    vxvy: Vector2;
}

export type SwipeCallback = (eventData: SwipeEventData) => void;
export type TapCallback = ({ event }: { event: HandledEvents }) => void;

export type SwipeableDirectionCallbacks = {
    /**
     * Called after a DOWN swipe
     */
    onSwipedDown: SwipeCallback;
    /**
     * Called after a LEFT swipe
     */
    onSwipedLeft: SwipeCallback;
    /**
     * Called after a RIGHT swipe
     */
    onSwipedRight: SwipeCallback;
    /**
     * Called after a UP swipe
     */
    onSwipedUp: SwipeCallback;
};

export type SwipeableCallbacks = SwipeableDirectionCallbacks & {
    /**
     * Called at start of a tracked swipe.
     */
    onSwipeStart: SwipeCallback;
    /**
     * Called after any swipe.
     */
    onSwiped: SwipeCallback;
    /**
     * Called for each move event during a tracked swipe.
     */
    onSwiping: SwipeCallback;
    /**
     * Called after a tap. A touch under the min distance, `delta`.
     */
    onTap: TapCallback;
    /**
     * Called for `touchstart` and `mousedown`.
     */
    onTouchStartOrOnMouseDown: TapCallback;
    /**
     * Called for `touchend` and `mouseup`.
     */
    onTouchEndOrOnMouseUp: TapCallback;
};

// Configuration Options
export type ConfigurationOptionDelta =
    | number
    | { [key in Lowercase<SwipeDirections>]?: number };

export interface ConfigurationOptions {
    /**
     * Min distance(px) before a swipe starts. **Default**: `10`
     */
    delta: ConfigurationOptionDelta;
    /**
     * Prevents scroll during swipe in most cases. **Default**: `false`
     */
    preventScrollOnSwipe: boolean;
    /**
     * Allows to prevent event
     */
    noPassive: boolean;
    /**
     * Set a rotation angle. **Default**: `0`
     */
    rotationAngle: number;
    /**
     * Track mouse input. **Default**: `false`
     */
    trackMouse: boolean;
    /**
     * Track touch input. **Default**: `true`
     */
    trackTouch: boolean;
    /**
     * Allowable duration of a swipe (ms). **Default**: `Infinity`
     */
    swipeDuration: number;
    /**
     * Options for touch event listeners
     */
    touchEventOptions: { passive: boolean };
}

export type SwipeableProps = Partial<SwipeableCallbacks & ConfigurationOptions>;

export type SwipeablePropsWithDefaultOptions = Partial<SwipeableCallbacks> &
    ConfigurationOptions;

export interface SwipeableHandlers {
    ref(element: HTMLElement | null): void;
    onMouseDown?(event: React.MouseEvent): void;
}

export type SwipeableState = {
    cleanUpTouch?: () => void;
    el?: HTMLElement;
    eventData?: SwipeEventData;
    first: boolean;
    initial: Vector2;
    start: number;
    swiping: boolean;
    xy: Vector2;
};

export type StateSetter = (
    state: SwipeableState,
    props: SwipeablePropsWithDefaultOptions
) => SwipeableState;
export type Setter = (stateSetter: StateSetter) => void;
export type AttachTouch = (
    el: HTMLElement,
    props: SwipeablePropsWithDefaultOptions
) => () => void;

const defaultProps: ConfigurationOptions = {
    delta: 10,
    preventScrollOnSwipe: false,
    noPassive: false,
    rotationAngle: 0,
    trackMouse: false,
    trackTouch: true,
    swipeDuration: Infinity,
    touchEventOptions: { passive: true },
};
const initialState: SwipeableState = {
    first: true,
    initial: [0, 0],
    start: 0,
    swiping: false,
    xy: [0, 0],
};
const mouseMove = "mousemove";
const mouseUp = "mouseup";
const touchEnd = "touchend";
const touchMove = "touchmove";
const touchStart = "touchstart";

function getDirection(
    absX: number,
    absY: number,
    deltaX: number,
    deltaY: number
): SwipeDirections {
    if (absX > absY) {
        if (deltaX > 0) {
            return RIGHT;
        }
        return LEFT;
    } else if (deltaY > 0) {
        return DOWN;
    }
    return UP;
}

function rotateXYByAngle(pos: Vector2, angle: number): Vector2 {
    if (angle === 0) return pos;
    const angleInRadians = (Math.PI / 180) * angle;
    const x =
        pos[0] * Math.cos(angleInRadians) + pos[1] * Math.sin(angleInRadians);
    const y =
        pos[1] * Math.cos(angleInRadians) - pos[0] * Math.sin(angleInRadians);
    return [x, y];
}

function getHandlers(
    set: Setter,
    handlerProps: { trackMouse: boolean | undefined }
): [
        {
            ref: (element: HTMLElement | null) => void;
            onMouseDown?: (event: React.MouseEvent) => void;
        },
        AttachTouch
    ] {
    const onStart = (event: HandledEvents) => {
        const isTouch = "touches" in event;
        // if more than a single touch don't track, for now...
        if (isTouch && event.touches.length > 1) return;

        set((state, props) => {
            // setup mouse listeners on document to track swipe since swipe can leave container
            if (props.trackMouse && !isTouch) {
                document.addEventListener(mouseMove, onMove);
                document.addEventListener(mouseUp, onUp);
            }
            const { clientX, clientY } = isTouch ? event.touches[0] : event;
            const xy = rotateXYByAngle([clientX, clientY], props.rotationAngle);

            props.onTouchStartOrOnMouseDown &&
                props.onTouchStartOrOnMouseDown({ event });

            return {
                ...state,
                ...initialState,
                initial: xy.slice() as Vector2,
                xy,
                start: event.timeStamp || 0,
            };
        });
    };

    const onMove = (event: HandledEvents) => {
        set((state, props) => {
            const isTouch = "touches" in event;
            // Discount a swipe if additional touches are present after
            // a swipe has started.
            if (isTouch && event.touches.length > 1) {
                return state;
            }

            // if swipe has exceeded duration stop tracking
            if (event.timeStamp - state.start > props.swipeDuration) {
                return state.swiping ? { ...state, swiping: false } : state;
            }

            const { clientX, clientY } = isTouch ? event.touches[0] : event;
            const [x, y] = rotateXYByAngle([clientX, clientY], props.rotationAngle);
            const deltaX = x - state.xy[0];
            const deltaY = y - state.xy[1];
            const absX = Math.abs(deltaX);
            const absY = Math.abs(deltaY);
            const time = (event.timeStamp || 0) - state.start;
            const velocity = Math.sqrt(absX * absX + absY * absY) / (time || 1);
            const vxvy: Vector2 = [deltaX / (time || 1), deltaY / (time || 1)];

            const dir = getDirection(absX, absY, deltaX, deltaY);

            // if swipe is under delta and we have not started to track a swipe: skip update
            const delta =
                typeof props.delta === "number"
                    ? props.delta
                    : props.delta[dir.toLowerCase() as Lowercase<SwipeDirections>] ||
                    defaultProps.delta as number;
            if (absX < delta && absY < delta && !state.swiping) return state;

            const eventData = {
                absX,
                absY,
                deltaX,
                deltaY,
                dir,
                event,
                first: state.first,
                initial: state.initial,
                velocity,
                vxvy,
            };

            // call onSwipeStart if present and is first swipe event
            eventData.first && props.onSwipeStart && props.onSwipeStart(eventData);

            // call onSwiping if present
            props.onSwiping && props.onSwiping(eventData);

            // track if a swipe is cancelable (handler for swiping or swiped(dir) exists)
            // so we can call preventDefault if needed
            let cancelablePageSwipe = false;
            if (
                props.onSwiping ||
                props.onSwiped ||
                props[`onSwiped${dir}` as keyof SwipeableDirectionCallbacks]
            ) {
                cancelablePageSwipe = true;
            }

            if (
                cancelablePageSwipe &&
                props.preventScrollOnSwipe &&
                props.trackTouch &&
                event.cancelable
            ) {
                event.preventDefault();
            }

            return {
                ...state,
                // first is now always false
                first: false,
                eventData,
                swiping: true,
            };
        });
    };

    const onEnd = (event: HandledEvents) => {
        set((state, props) => {
            let eventData: SwipeEventData | undefined;
            if (state.swiping && state.eventData) {
                // if swipe is less than duration fire swiped callbacks
                if (event.timeStamp - state.start < props.swipeDuration) {
                    eventData = { ...state.eventData, event };
                    props.onSwiped && props.onSwiped(eventData);

                    const onSwipedDir =
                        props[
                        `onSwiped${eventData.dir}` as keyof SwipeableDirectionCallbacks
                        ];
                    onSwipedDir && onSwipedDir(eventData);
                }
            } else {
                props.onTap && props.onTap({ event });
            }

            props.onTouchEndOrOnMouseUp && props.onTouchEndOrOnMouseUp({ event });

            return { ...state, ...initialState, eventData };
        });
    };

    const cleanUpMouse = () => {
        // safe to just call removeEventListener
        document.removeEventListener(mouseMove, onMove);
        document.removeEventListener(mouseUp, onUp);
    };

    const onUp = (e: HandledEvents) => {
        cleanUpMouse();
        onEnd(e);
    };

    /**
     * The value of passive on touchMove depends on `preventScrollOnSwipe`:
     * - true => { passive: false }
     * - false => { passive: true } // Default
     *
     * NOTE: When preventScrollOnSwipe is true, we attempt to call preventDefault to prevent scroll.
     *
     * props.touchEventOptions can also be set for all touch event listeners,
     * but for `touchmove` specifically when `preventScrollOnSwipe` it will
     * supersede and force passive to false.
     *
     */
    const attachTouch: AttachTouch = (el, props) => {
        let cleanup = () => { };
        if (el && el.addEventListener) {
            const baseOptions = {
                ...defaultProps.touchEventOptions,
                ...props.touchEventOptions,
            };
            // attach touch event listeners and handlers
            const tls: [
                typeof touchStart | typeof touchMove | typeof touchEnd,
                (e: HandledEvents) => void,
                { passive: boolean }
            ][] = [
                    [touchStart, onStart, baseOptions],
                    // preventScrollOnSwipe option supersedes touchEventOptions.passive
                    [
                        touchMove,
                        onMove,
                        {
                            ...baseOptions,
                            ...(props.preventScrollOnSwipe || props.noPassive ? { passive: false } : {}),
                        },
                    ],
                    [touchEnd, onEnd, baseOptions],
                ];
            tls.forEach(([e, h, o]) => el.addEventListener(e, h, o));
            // return properly scoped cleanup method for removing listeners, options not required
            cleanup = () => tls.forEach(([e, h]) => el.removeEventListener(e, h));
        }
        return cleanup;
    };

    const onRef = (el: HTMLElement | null) => {
        // "inline" ref functions are called twice on render, once with null then again with DOM element
        // ignore null here
        if (el === null) return;
        set((state, props) => {
            // if the same DOM el as previous just return state
            if (state.el === el) return state;

            const addState: { cleanUpTouch?: () => void } = {};
            // if new DOM el clean up old DOM and reset cleanUpTouch
            if (state.el && state.el !== el && state.cleanUpTouch) {
                state.cleanUpTouch();
                addState.cleanUpTouch = void 0;
            }
            // only attach if we want to track touch
            if (props.trackTouch && el) {
                addState.cleanUpTouch = attachTouch(el, props);
            }

            // store event attached DOM el for comparison, clean up, and re-attachment
            return { ...state, el, ...addState };
        });
    };

    // set ref callback to attach touch event listeners
    const output: { ref: typeof onRef; onMouseDown?: typeof onStart } = {
        ref: onRef,
    };

    // if track mouse attach mouse down listener
    if (handlerProps.trackMouse) {
        output.onMouseDown = onStart;
    }

    return [output, attachTouch];
}

function updateTransientState(
    state: SwipeableState,
    props: SwipeablePropsWithDefaultOptions,
    previousProps: SwipeablePropsWithDefaultOptions,
    attachTouch: AttachTouch
) {
    // if trackTouch is off or there is no el, then remove handlers if necessary and exit
    if (!props.trackTouch || !state.el) {
        if (state.cleanUpTouch) {
            state.cleanUpTouch();
        }

        return {
            ...state,
            cleanUpTouch: undefined,
        };
    }

    // trackTouch is on, so if there are no handlers attached, attach them and exit
    if (!state.cleanUpTouch) {
        return {
            ...state,
            cleanUpTouch: attachTouch(state.el, props),
        };
    }

    // trackTouch is on and handlers are already attached, so if preventScrollOnSwipe changes value,
    // remove and reattach handlers (this is required to update the passive option when attaching
    // the handlers)
    if (
        props.preventScrollOnSwipe !== previousProps.preventScrollOnSwipe ||
        props.touchEventOptions.passive !== previousProps.touchEventOptions.passive
    ) {
        state.cleanUpTouch();

        return {
            ...state,
            cleanUpTouch: attachTouch(state.el, props),
        };
    }

    return state;
}

export function useSwipeable(options: SwipeableProps): SwipeableHandlers {
    const { trackMouse } = options;
    const transientState = React.useRef({ ...initialState });
    const transientProps = React.useRef<SwipeablePropsWithDefaultOptions>({
        ...defaultProps,
    });

    // track previous rendered props
    const previousProps = React.useRef<SwipeablePropsWithDefaultOptions>({
        ...transientProps.current,
    });
    previousProps.current = { ...transientProps.current };

    // update current render props & defaults
    transientProps.current = {
        ...defaultProps,
        ...options,
    };
    // Force defaults for config properties
    let defaultKey: keyof ConfigurationOptions;
    for (defaultKey in defaultProps) {
        if (transientProps.current[defaultKey] === void 0) {
            (transientProps.current[defaultKey] as any) = defaultProps[defaultKey];
        }
    }

    const [handlers, attachTouch] = React.useMemo(
        () =>
            getHandlers(
                (stateSetter) =>
                (transientState.current = stateSetter(
                    transientState.current,
                    transientProps.current
                )),
                { trackMouse }
            ),
        [trackMouse]
    );

    transientState.current = updateTransientState(
        transientState.current,
        transientProps.current,
        previousProps.current,
        attachTouch
    );

    return handlers;
}

export default useSwipeable;
