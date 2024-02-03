import * as React from 'react';
import { useContext, useRef, useCallback, useMemo } from 'react';
import { createContext } from 'react';

import useResolved from '../hooks/useResolved';
import useActualValue from '../../../hooks/useActualValue';

import IField from '../../../model/IField';
import IAnything from '../../../model/IAnything';
import IOneProps from '../../../model/IOneProps';

import deepClone from '../../../utils/deepClone';

interface IStateProviderProps<Data = IAnything, Payload = IAnything, Field extends IField<Data, Payload> = IField<Data, Payload>> extends 
    IOneProps<Data, Payload, Field> {
    payload: Payload;
    children: React.ReactElement;
}

interface IState<Data = IAnything> {
    object: Data | null;
    setObject: (data: Data, invalidMap: Record<string, boolean>) => void;
    changeObject: (data: Data) => void;
}

const StateContext = createContext<IState>(null as never);

export const StateProvider = <Data extends IAnything, Payload extends IAnything, Field extends IField<Data, Payload> = IField<Data, Payload>>({
    children,
    ...otherProps
}: IStateProviderProps<Data, Payload, Field>) => {

    const oneInvalidMapRef = useRef<Record<string, boolean>>({});
    const wasInvalidRef = useRef(false);

    const {
        fields = [],
        features,
        change = () => null,
        fallback = () => null,
        handler = () => ({} as Data),
        payload,
        loadStart,
        loadEnd,
    } = otherProps;

    const [object, setObjectHook] = useResolved<Data, Payload>({
        handler,
        fallback,
        fields,
        features,
        payload,
        change,
        loadStart,
        loadEnd,
    });

    const object$ = useActualValue(object as unknown as object);

    const setObject = useCallback((data: Data, fieldInvalidMap: Record<string, boolean>) => {
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
    }, []);

    const changeObject = useCallback(
        (object: Data) =>
          setObject(
            deepClone({
              ...object$.current,
              ...object as unknown as object,
            }),
            {}
          ),
        []
      );

    const managed: IState<Data> = useMemo(() => ({
        object,
        setObject,
        changeObject,
    }), [object]);

    return (
        <StateContext.Provider value={managed}>
            {!!object && children}
        </StateContext.Provider>
    );
};

export const useOneState = <Data extends IAnything>() => useContext(StateContext) as IState<Data>;

export default StateProvider;
