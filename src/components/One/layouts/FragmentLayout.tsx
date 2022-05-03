import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';

export interface IFragmentLayoutProps<Data = IAnything> {
    isVisible?: PickProp<IField<Data>, 'isVisible'>;
}

interface IFragmentLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactChild;
    ready: PickProp<IEntity<Data>, 'ready'>;
    object: PickProp<IEntity<Data>, 'object'>;
}

/**
 * Компоновка, которую можно скрыть, используя isVisible.
 * Потомки передаются насквозь...
 */
export const FragmentLayout = <Data extends IAnything = IAnything>({
    children,
    isVisible = () => true,
    object,
    ready,
}: IFragmentLayoutProps<Data> & IFragmentLayoutPrivate<Data>) => {
    const [visible, setVisible] = useState(true);
    useEffect(() => {
        const visible = isVisible(object);
        if (!visible) {
            ready();
        }
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
