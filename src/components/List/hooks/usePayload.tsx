import * as React from 'react';
import { createContext, useContext } from 'react';

import useSingleton from '../../../hooks/useSingleton';

import IAnything from '../../../model/IAnything';
import IListProps from '../../../model/IListProps';

const PayloadContext = createContext<IAnything>(null as never);

/**
 * Interface representing the props for the IPayloadProvider component.
 */
interface IPayloadProviderProps {
    children: React.ReactNode;
    value: Exclude<IListProps['payload'], undefined>;
}

/**
 * PayloadProvider component.
 *
 * @param props - The component props.
 * @param props.children - The child components.
 * @param [props.value={}] - The initial value of the payload.
 *
 * @returns - The component's rendered output.
 */
export const PayloadProvider = ({
    children,
    value = {},
}: IPayloadProviderProps) => {
    const payload = useSingleton(value);
    return (
        <PayloadContext.Provider value={payload}>
            {children}
        </PayloadContext.Provider>
    );
};

/**
 * Retrieves the payload from the `PayloadContext` using the `useContext` hook.
 *
 * @returns The payload from the `PayloadContext`.
 */
export const usePayload = () => useContext(PayloadContext);

export default usePayload;
