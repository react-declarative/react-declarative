import * as React from 'react';

import { createContext } from 'react';
import { useState, useContext } from 'react';

type Subscription = (name: string) => [
    () => string,
    (value: string) => void,
];

interface IRadioHelperProps {
    children: React.ReactChild;
}

const RadioContext = createContext<Subscription>(null as never);

export const RadioHelper = ({
    children,
}: IRadioHelperProps) => {
    const [registry, setRegistry] = useState({});

    const createHandleRead = (name: string) => () => registry[name];
    
    const createHandleWrite = (name: string) => (value: string) => setRegistry({
        ...registry,
        [name]: value,
    });

    const error = () => {
        throw new Error('RadioHelper name is required');
    };

    const handler: Subscription = (name: string) => {
        if (name) {
            return [
                createHandleRead(name),
                createHandleWrite(name),
            ];
        } else {
            return [
                error,
                error,
            ];
        }
    };

    return (
        <RadioContext.Provider value={handler}>
            {children}
        </RadioContext.Provider>
    );
};

export const useRegistry = (name: string) => useContext(RadioContext)(name);

export default RadioHelper;
