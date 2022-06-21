import * as React from 'react';

import { createContext, useContext, useMemo } from "react";

export const createProvider = <T extends any, P extends any>(createPayload: (props: P) => T) => {

    const Context = createContext<T>(null as never);
    
    const Provider = ({
        children,
        ...props
    }: React.PropsWithChildren<P>) => {
        const payload = useMemo(() => createPayload(props as P), []);
        return (
            <Context.Provider value={payload}>
                {children}
            </Context.Provider>
        );
    };

    const usePayload = () => useContext(Context);

    return [Provider, usePayload] as const;
};

export default createProvider;
