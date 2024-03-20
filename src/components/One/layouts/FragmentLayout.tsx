import * as React from 'react';
import { useState, useEffect, Fragment } from 'react';

import { useOnePayload } from '../context/PayloadProvider';

import IField from '../../../model/IField';
import IEntity from '../../../model/IEntity';
import IAnything from '../../../model/IAnything';
import { PickProp } from '../../../model/IManaged';
import { useOneState } from '../context/StateProvider';

/**
 * Represents the props for the IFragmentLayout component.
 *
 * @template Data - The type of data for the fragment layout.
 * @template Payload - The type of payload for the fragment layout.
 */
export interface IFragmentLayoutProps<Data = IAnything, Payload = IAnything> {
    isVisible?: PickProp<IField<Data, Payload>, 'isVisible'>;
    features?: PickProp<IField<Data, Payload>, 'features'>;
    hidden?: PickProp<IField<Data, Payload>, 'hidden'>;
}

/**
 * Represents a private layout interface for a fragment.
 * @interface
 * @template Data - The type of data the fragment holds.
 */
interface IFragmentLayoutPrivate<Data = IAnything> extends IEntity<Data> {
    children?: React.ReactNode;
    ready: PickProp<IEntity<Data>, 'ready'>;
}

/**
 * Component that conditionally renders its children based on the visibility criteria.
 *
 * @param props - The component props.
 * @param props.children - The children to be rendered.
 * @param props.isVisible - The function used to determine if the component should be visible.
 * @param props.ready - The function to be called when the component is ready.
 * @param props.object - The object used by the `isVisible` function.
 *
 * @returns - The rendered React node.
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
