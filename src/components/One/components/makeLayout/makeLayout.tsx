import * as React from 'react';
import { memo, cloneElement, useEffect, useMemo } from 'react';

import { makeStyles } from '../../../../styles';

import { useOnePayload } from '../../context/PayloadProvider';
import { useOneState } from '../../context/StateProvider';

import useLayoutState from './useLayoutState';
import useMediaContext from '../../../../hooks/useMediaContext';

import IAnything from '../../../../model/IAnything';
import IEntity from '../../../../model/IEntity';

import classNames from '../../../../utils/classNames';

/**
 * Creates and returns an object with CSS styles using the `makeStyles` function from Material-UI.
 * The returned object contains different style classes for different situations.
 *
 * @returns The object with CSS style classes.
 *
 */
const useStyles = makeStyles()({
    hidden: {
        display: 'none !important',
    },
    disabled: {
        pointerEvents: 'none',
        touchAction: 'none',
    },
    readonly: {
        pointerEvents: 'none',
        touchAction: 'none',
    },
});

/**
 * Represents the layout of a component.
 *
 * @template Data - The type of data associated with the layout.
 */
export interface ILayout<Data extends IAnything = IAnything> extends IEntity<Data> {
    children: React.ReactElement[];
}

const DEFAULT_IS_VISIBLE = () => true;
const DEFAULT_IS_READONLY = () => false;
const DEFAULT_IS_DISABLED = () => false;

/**
 * Renders a component based on input data and conditions.
 *
 * @template T - The type of layout component
 * @param originalComponent - The original component to be wrapped
 * @returns - The wrapped component
 */
export function makeLayout<T extends ILayout<any>>(
    originalComponent: React.FC<T>,
) {

    const Component = memo(originalComponent) as unknown as React.FC<ILayout>;

    /**
     * Renders a component based on input data and conditions.
     *
     * @template Data - The type of data that the component accepts
     * @param props - The component props
     * @param [props.className] - The class name for the component
     * @param props.object - The main data object for the component
     * @param [props.isVisible=true] - Whether the component is visible or not
     * @param [props.isReadonly=false] - Whether the component is readonly or not
     * @param [props.isDisabled=false] - Whether the component is disabled or not
     * @param [props.disabled=false] - Whether the component is disabled or not (alternative prop)
     * @param [props.phoneHidden] - Whether the component is hidden on phone devices or not, or a function that returns a boolean
     * @param [props.tabletHidden] - Whether the component is hidden on tablet devices or not, or a function that returns a boolean
     * @param [props.desktopHidden] - Whether the component is hidden on desktop devices or not, or a function that returns a boolean
     * @param props.ready - A callback function to be executed when the component is ready
     * @param props.otherProps - Additional props to pass to the component
     * @returns - The rendered component or null if not visible
     */
    const component = <Data extends IAnything = IAnything>({
        className,
        children,
        object: upperObject,
        isVisible = DEFAULT_IS_VISIBLE,
        isReadonly = DEFAULT_IS_READONLY,
        isDisabled = DEFAULT_IS_DISABLED,
        disabled: upperDisabled = false,
        phoneHidden: upperPhoneHidden,
        tabletHidden: upperTabletHidden,
        desktopHidden: upperDesktopHidden,
        ready,
        ...otherProps
    }: ILayout<Data>) => {
        
        const { classes } = useStyles();

        const payload = useOnePayload();
        const { object: stateObject } = useOneState<Data>();

        const { phoneHidden, tabletHidden, desktopHidden, hasHiddenConstraint } = useMemo(() => {
            const phoneHidden = typeof upperPhoneHidden === 'function' ? upperPhoneHidden(payload) : upperPhoneHidden;
            const tabletHidden = typeof upperTabletHidden === 'function' ? upperTabletHidden(payload) : upperTabletHidden;
            const desktopHidden = typeof upperDesktopHidden === 'function' ? upperDesktopHidden(payload) : upperDesktopHidden;
            const hasHiddenConstraint = phoneHidden || tabletHidden || desktopHidden;
            return { 
                phoneHidden,
                tabletHidden,
                desktopHidden,
                hasHiddenConstraint,
            };
        }, []);

        const { isPhone = false, isTablet = false, isDesktop = false } = hasHiddenConstraint ? useMediaContext() : {};

        const object = stateObject || upperObject;

        const {
            state: {
                disabled,
                readonly,
                visible,
            },
            action: {
                setDisabled,
                setReadonly,
                setVisible,
            },
        } = useLayoutState({
            disabled: upperDisabled,
        })

        useEffect(() => {
            const disabled = isDisabled(object, payload);
            const visible = isVisible(object, payload);
            const readonly = isReadonly(object, payload);
            setReadonly(readonly);
            setDisabled(disabled);
            setVisible(visible);
            /**
            * Отображаем форму только после отклика всех
            * полей
            */
           !visible && ready();
        }, [object]);

        const renderInner = () => {
            if (disabled) {
                return React.Children.map(children, (child: React.ReactElement) => 
                    cloneElement(child, { disabled: true })
                );
            }
            if (readonly) {
                return React.Children.map(children, (child: React.ReactElement) => 
                    cloneElement(child, { readonly: true })
                );
            }
            return children;
        };

        if (!visible) {
            return null;
        }

        if (phoneHidden && isPhone) {
            return null;
        }

        if (tabletHidden && isTablet) {
            return null;
        }

        if (desktopHidden && isDesktop) {
            return null;
        }

        return (
            <Component
                className={classNames(className, {
                    [classes.disabled]: disabled || upperDisabled,
                    [classes.hidden]: !visible,
                    [classes.readonly]: readonly,
                })}
                ready={ready}
                object={object}
                {...otherProps}
            >
                {renderInner()}
            </Component>
        );
    };

    component.displayName = `Wrapped${originalComponent.displayName || 'UnknownLayout'}`;

    return memo(component) as typeof originalComponent;
}

export default makeLayout;

