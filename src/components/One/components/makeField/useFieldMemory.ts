import { useMemo } from 'react';

import IAnything from '../../../../model/IAnything';
import { Value } from '../../../../model/IField';

interface IMemory {
    inputUpdate: boolean;
    objectUpdate: boolean;
    fieldName: string;
    isMounted: boolean;
    lastDebouncedValue: Value;
    fieldReadonly$: boolean;
    upperReadonly$: boolean;
    focusReadonly$: boolean;
    debouncedValue$: Value;
    invalid$: string | null;
    object$: IAnything;
    value$: Value;
    groupRef$: HTMLDivElement;
}

interface IMemoryData extends Omit<IMemory, keyof {
    inputUpdate: never;
    objectUpdate: never;
    isMounted: never;
}> { }

export const useFieldMemory = ({
    fieldName,
    lastDebouncedValue,
    debouncedValue$,
    fieldReadonly$,
    focusReadonly$,
    invalid$,
    object$,
    upperReadonly$,
    value$,
    groupRef$,
}: IMemoryData) => {
    const memory = useMemo((): IMemory => ({
        inputUpdate: false,
        objectUpdate: false,
        fieldName,
        lastDebouncedValue,
        isMounted: true,
        debouncedValue$: null as never,
        fieldReadonly$: null as never,
        focusReadonly$: null as never,
        invalid$: null as never,
        object$: null as never,
        upperReadonly$: null as never,
        value$: null as never,
        groupRef$: null as never,
    }), []);
    memory.debouncedValue$ = debouncedValue$;
    memory.fieldReadonly$ = fieldReadonly$;
    memory.focusReadonly$ = focusReadonly$;
    memory.invalid$ = invalid$;
    memory.object$ = object$;
    memory.upperReadonly$ = upperReadonly$;
    memory.value$ = value$;
    memory.groupRef$ = groupRef$;
    return { memory };
}

export default useFieldMemory;
