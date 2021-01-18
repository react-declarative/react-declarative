import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';

import IEntity from '../model/IEntity';
import IField from '../model/IField';
import { PickProp } from '../model/IManaged';

export interface IFragmentLayoutProps {
    isVisible?: PickProp<IField, 'isVisible'>;
}

interface IFragmentLayoutPrivate extends IEntity {
    children: React.ReactChild;
    ready: PickProp<IEntity, 'ready'>;
    object: PickProp<IEntity, 'object'>;
}

/**
 * Компоновка, которую можно скрыть, используя isVisible.
 * Потомки передаются насквозь...
 */
export const FragmentLayout = ({
    children,
    isVisible = () => true,
    object,
    ready,
}: IFragmentLayoutProps & IFragmentLayoutPrivate) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const visible = isVisible(object, (v) => setVisible(v));
        if (!visible) { ready(); }
        setVisible(visible);
    }, [object]);
    if (visible) {
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    } else {
        return null;
    }
};

FragmentLayout.displayName = 'FragmentLayout';

export default FragmentLayout;
