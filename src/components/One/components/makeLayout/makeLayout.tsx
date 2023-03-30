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
        isDisabled = () => false,
        disabled: upperDisabled = false,
        ...otherProps
    }: ILayout<Data>) => {

        const [disabled, setDisabled] = useState<boolean>(upperDisabled);
        const [visible, setVisible] = useState<boolean>(true);

        const { classes } = useStyles();

        const payload = useOnePayload();
        const { object } = useOneState<Data>();

        useEffect(() => {
            if (object) {
                setDisabled(isDisabled(object, payload));
                setVisible(isVisible(object, payload));
            }
        }, [object]);

        return (
            <Component
                className={classNames(className, {
                    [classes.disabled]: disabled,
                    [classes.hidden]: !visible,
                })}
                {...otherProps}
            />
        );
    };

    component.displayName = `Wrapped${Component.displayName || 'UnknownLayout'}`;

    return memo(component) as typeof OriginalComponent;
}

export default makeLayout;

