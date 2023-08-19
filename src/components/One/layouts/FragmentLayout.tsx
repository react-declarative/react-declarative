import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';

import { useOnePayload } from '../context/PayloadProvider';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';
import { useOneState } from '../context/StateProvider';

export interface IFragmentLayoutProps<Data = IAnything, Payload = IAnything> {
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
}

interface IFragmentLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children?: React.ReactNode;
    ready: PickProp<IEntity<Data>, 'ready'>;
}

/**
 * Компоновка, которую можно скрыть, используя isVisible.
 * Потомки передаются насквозь...
 */
export const FragmentLayout = <Data extends IAnything = IAnything>({
    children,
    isVisible = () => true,
    ready,
}: IFragmentLayoutProps<Data> & IFragmentLayoutPrivate<Data>) => {
    const [visible, setVisible] = useState(true);
    const payload = useOnePayload();
    const { object } = useOneState<Data>();
    useEffect(() => {
        if (object) {
            const visible = isVisible(object, payload);
            setVisible(visible);
        }
        ready();
    }, [object]);
    if (visible) {
        return (
            <Fragment>
                {children}
            </Fragment>
        );
    } else {
        return <Fragment />;
    }
};

FragmentLayout.displayName = 'FragmentLayout';

export default FragmentLayout as typeof FragmentLayout;
