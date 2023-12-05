import * as React from 'react';
import { useEffect, useState } from 'react';

import IModal from '../model/IModal';

interface IBootstrapProps extends IModal {
    modalStack: IModal[];
    count: number;
}

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
        setMounted(true)
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
