import * as React from 'react';
import { memo, useEffect } from 'react';

import { makeStyles } from '../../../../styles';

import { useOnePayload } from '../../context/PayloadProvider';
import { useOneState } from '../../context/StateProvider';

import useLayoutState from './useLayoutState';

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
        opacity: 0.8,
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
        isVisible = DEFAULT_IS_VISIBLE,
        isReadonly = DEFAULT_IS_READONLY,
        isDisabled = DEFAULT_IS_DISABLED,
        disabled: upperDisabled = false,
        ready,
        ...otherProps
    }: ILayout<Data>) => {

        const { classes } = useStyles();

        const payload = useOnePayload();
        const { object } = useOneState<Data>();

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
            isVisible,
            isDisabled,
            isReadonly,
            object,
            payload,
        });

        useEffect(() => {
            if (object) {
                setReadonly(isReadonly(object, payload));
                setDisabled(isDisabled(object, payload));
                setVisible(isVisible(object, payload));
            }
            /**
            * Отображаем форму только после отклика всех
            * полей
            */
           ready();
        }, [object]);

        return (
            <Component
                className={classNames(className, {
                    [classes.disabled]: disabled || upperDisabled,
                    [classes.hidden]: !visible,
                    [classes.readonly]: readonly,
                })}
                ready={ready}
                {...otherProps}
            />
        );
    };

    component.displayName = `Wrapped${originalComponent.displayName || 'UnknownLayout'}`;

    return memo(component) as typeof originalComponent;
}

export default makeLayout;

