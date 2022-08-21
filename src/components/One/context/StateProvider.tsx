import * as React from 'react';
import { useContext, useRef } from 'react';
import { createContext } from 'react';

import useResolved from '../hooks/useResolved';

import useActualValue from '../../../hooks/useActualValue';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IOneProps from '../../../model/IOneProps';

interface IStateProviderProps<Data = IAnything, Field extends IField<Data> = IField<Data>> extends 
    IOneProps<Data, Field> {
    children: React.ReactElement;
}

interface IState<Data = IAnything> {
    object: Data | null;
    setObject: (data: Data, invalidMap: Record<string, boolean>) => void;
}

const StateContext = createContext<IState>(null as never);

export const StateProvider = <Data extends IAnything, Field extends IField<Data> = IField<Data>>({
    children,
    ...otherProps
}: IStateProviderProps<Data, Field>) => {

    const oneInvalidMapRef = useRef<Record<string, boolean>>({});
    const wasInvalidRef = useRef(false);

    const {
        fields = [],
        roles,
        change = () => null,
        fallback = () => null,
        handler = () => ({} as Data),
        loadStart,
        loadEnd,
    } = otherProps;

    const [object, setObjectHook] = useResolved<Data>({
        handler,
        fallback,
        fields,
        roles,
        change,
        loadStart,
        loadEnd,
    });

    const object$ = useActualValue(object);

    const setObject = (data: Data, fieldInvalidMap: Record<string, boolean>) => {
        const { current: oneInvalidMap } = oneInvalidMapRef;
        const { current: object } = object$;
        setObjectHook(data);
        Object.entries(fieldInvalidMap).forEach(([key, value]) => {
            oneInvalidMap[key] = value;
        });
        if (!Object.values(oneInvalidMap).some((isTrue) => isTrue)) {
            if (data !== object || wasInvalidRef.current) {
                wasInvalidRef.current = false;
                change!(data, false);
            }
        } else {
            wasInvalidRef.current = true;
        }
    };

    const managed: IState<Data> = {
        object,
        setObject,
    };

    return (
        <StateContext.Provider value={managed}>
            {!!object && children}
        </StateContext.Provider>
    );
};

export const useOneState = <Data extends IAnything>() => useContext(StateContext) as IState<Data>;

export default StateProvider;
