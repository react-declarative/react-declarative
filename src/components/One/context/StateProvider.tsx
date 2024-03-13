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

/**
 * StateProvider is a component that manages the state of an object and provides it to its children components through a context.
 * It takes in various props to configure its behavior.
 *
 * @template Data - The type of the object being managed by the StateProvider.
 * @template Payload - The type of the payload used for fetching the object.
 * @template Field - The type of the field used for validating the object.
 *
 * @param props - The props used to configure the StateProvider.
 * @param props.children - The children components to be rendered within the StateProvider.
 * @param props.fields - The fields used for validating the object.
 * @param props.features - The features used for manipulating the object.
 * @param props.change - The function called when the object is changed.
 * @param props.fallback - The function called when the object cannot be resolved.
 * @param props.handler - The function used for fetching the object.
 * @param props.payload - The payload used for fetching the object.
 * @param props.loadStart - The function called when the object starts loading.
 * @param props.loadEnd - The function called when the object finishes loading.
 *
 * @return - The rendered children components wrapped in the StateContext.Provider.
 *
 * @example
 * <StateProvider
 *    fields={fields}
 *    features={features}
 *    change={change}
 *    fallback={fallback}
 *    handler={handler}
 *    payload={payload}
 *    loadStart={loadStart}
 *    loadEnd={loadEnd}
 * >
 *    {children}
 * </StateProvider>
 */
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
