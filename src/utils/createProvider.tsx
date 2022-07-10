import * as React from 'react';

import { createContext, useContext, useMemo } from "react";

export const createProvider = <P extends any>(createPayload = (p: P) => p) => {

    const Context = createContext<ReturnType<typeof createPayload>>(null as never);

    const Provider = ({
        children,
        payload,
    }: React.PropsWithChildren<{
        payload?: P;
    }>) => {
        const value = useMemo(() => createPayload(payload!), [payload]);
        return (
            <Context.Provider value={value}>
                {children}
            </Context.Provider>
        );
    };

    const usePayload = () => useContext(Context);

    return [Provider, usePayload] as const;
};

export default createProvider;
