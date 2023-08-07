import * as React from 'react';
import { memo, useState, useEffect } from 'react';

import { makeStyles } from '../../../../styles';

import { useOnePayload } from '../../context/PayloadProvider';
import { useOneState } from '../../context/StateProvider';

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

export function makeLayout<T extends ILayout<any>>(
    OriginalComponent: React.FC<T>,
) {

    const Component = OriginalComponent as React.FC<IEntity>;

    const component = <Data extends IAnything = IAnything>({
        className,
        isVisible = () => true,
        isReadonly = () => false,
        isDisabled = () => false,
        disabled: upperDisabled = false,
        ready,
        ...otherProps
    }: ILayout<Data>) => {

        const [disabled, setDisabled] = useState<boolean>(upperDisabled);
        const [readonly, setReadonly] = useState<boolean>(false);
        const [visible, setVisible] = useState<boolean>(true);

        const { classes } = useStyles();

        const payload = useOnePayload();
        const { object } = useOneState<Data>();

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
                    [classes.disabled]: disabled,
                    [classes.hidden]: !visible,
                    [classes.readonly]: readonly,
                })}
                ready={ready}
                {...otherProps}
            />
        );
    };

    component.displayName = `Wrapped${Component.displayName || 'UnknownLayout'}`;

    return memo(component) as typeof OriginalComponent;
}

export default makeLayout;

