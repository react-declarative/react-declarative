import * as React from 'react';
import { memo, useEffect, useMemo } from 'react';

import { makeStyles } from '../../../../styles';

import { useOnePayload } from '../../context/PayloadProvider';
import { useOneState } from '../../context/StateProvider';

import useLayoutState from './useLayoutState';
import useMediaContext from '../../../../hooks/useMediaContext';

import IAnything from '../../../../model/IAnything';
import IEntity from '../../../../model/IEntity';

import classNames from '../../../../utils/classNames';

const useStyles = makeStyles()({
    hidden: {
        display: 'none !important',
    },
    disabled: {
        pointerEvents: 'none',
        touchAction: 'none',
        opacity: 0.5,
    },
    readonly: {
        pointerEvents: 'none',
    },
});

export interface ILayout<Data extends IAnything = IAnything> extends IEntity<Data> {
    children: React.ReactNode;
}

const DEFAULT_IS_VISIBLE = () => true;
const DEFAULT_IS_READONLY = () => false;
const DEFAULT_IS_DISABLED = () => false;

export function makeLayout<T extends ILayout<any>>(
    originalComponent: React.FC<T>,
) {

    const Component = memo(originalComponent) as unknown as React.FC<IEntity>;

    const component = <Data extends IAnything = IAnything>({
        className,
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
            />
        );
    };

    component.displayName = `Wrapped${originalComponent.displayName || 'UnknownLayout'}`;

    return memo(component) as typeof originalComponent;
}

export default makeLayout;

