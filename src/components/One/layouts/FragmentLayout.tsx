import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';

import { useOnePayload } from '../context/PayloadProvider';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';

export interface IFragmentLayoutProps<Data = IAnything, Payload = IAnything> {
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
}

interface IFragmentLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children: React.ReactNode;
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
    const payload = useOnePayload();
    useEffect(() => {
        const visible = isVisible(object, payload);
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
