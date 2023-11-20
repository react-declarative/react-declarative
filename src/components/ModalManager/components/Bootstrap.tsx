import * as React from 'react';
import { useEffect } from 'react';

import IModal from '../model/IModal';

interface IBootstrapProps extends IModal {
    modalStack: IModal[];
}

export const Bootstrap = ({
    render,
    onMount,
    onUnmount,
    modalStack,
}: IBootstrapProps) => {

    useEffect(() => {
        onMount && onMount(modalStack);
        return () => onUnmount && onUnmount(modalStack);
    }, []);

    return (
        <>
            {render()}
        </>
    );
}

export default Bootstrap;
