import * as React from 'react';
import { useContext, useRef } from 'react';
import { createContext } from 'react';

import useResolved from '../hooks/useResolved';

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

    const setObject = (data: Data, fieldInvalidMap: Record<string, boolean>) => {
        const { current: oneInvalidMap } = oneInvalidMapRef;
        setObjectHook(data);
        Object.entries(fieldInvalidMap).forEach(([key, value]) => {
            oneInvalidMap[key] = value;
        });
        if (!Object.values(oneInvalidMap).some((isTrue) => isTrue)) {
            change!(data, false);
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
