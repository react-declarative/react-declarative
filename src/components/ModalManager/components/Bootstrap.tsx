import * as React from 'react';
import { useEffect, useState } from 'react';

import IModal from '../model/IModal';

/**
 * Interface representing the props for the Bootstrap component.
 * @interface
 * @extends IModal
 */
interface IBootstrapProps extends IModal {
    modalStack: IModal[];
    count: number;
}

/**
 * Function component that handles the Bootstrap initialization and rendering.
 *
 * @param props - The props passed to the component.
 * @param props.render - The function to render the content.
 * @param props.onMount - The function to call when the component is mounted.
 * @param props.onUnmount - The function to call when the component is unmounted.
 * @param props.count - The count value.
 * @param props.modalStack - The modal stack value.
 * @returns The rendered component or null if not mounted.
 */
export const Bootstrap = ({
    render,
    onMount,
    onUnmount,
    count,
    modalStack,
}: IBootstrapProps) => {

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        onMount && onMount(count, modalStack);
        setMounted(true);
        /**
         * Calls the `onUnmount` function and passes the `count` and `modalStack` as parameters
         *
         * @param count - The count parameter to be passed to `onUnmount` function
         * @param modalStack - The modal stack to be passed to `onUnmount` function
         *
         * @returns
         */
        return () => {
            onUnmount && onUnmount(count, modalStack);
        };
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            {render()}
        </>
    );
}

export default Bootstrap;
