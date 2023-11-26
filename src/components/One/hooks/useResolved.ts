import { useRef, useState, useLayoutEffect, useEffect } from 'react';

import IField from '../../../model/IField';

import initialValue from '../config/initialValue';
import isStatefull from '../config/isStatefull';

import deepCompare from '../../../utils/deepCompare';
import deepClone from '../../../utils/deepClone';
import deepFlat from '../../../utils/deepFlat';
import assign from '../../../utils/deepMerge';
import create from '../../../utils/create';

import set from '../../../utils/set';
import get from '../../../utils/get';

import IAnything from '../../../model/IAnything';
import IOneProps from '../../../model/IOneProps';
import IOneApi from '../../../model/IOneApi';

import useActualValue from '../../../hooks/useActualValue';
import useSubject from '../../../hooks/useSubject';

import { PickProp } from '../../../model/IManaged';

import { useApiRef } from '../context/ApiProvider';

const LOAD_SOURCE = 'one-resolve';

interface IResolvedHookProps<Data = IAnything, Payload = IAnything> {
    handler: PickProp<IOneProps<Data, Payload>, 'handler'>;
    fallback: PickProp<IOneProps<Data, Payload>, 'fallback'>;
    fields: PickProp<IOneProps<Data, Payload>, 'fields'>;
    payload: Payload;
    features: PickProp<IOneProps<Data, Payload>, 'features'>;
    change: PickProp<IOneProps<Data, Payload>, 'change'>;
    loadStart: PickProp<IOneProps<Data, Payload>, 'loadStart'>;
    loadEnd: PickProp<IOneProps<Data, Payload>, 'loadEnd'>;
}

const buildObj = <Data = IAnything, Payload = IAnything>(fields: IField<Data>[], payload: Payload, features?: string[]) => {
    const obj = {};
    if (fields) {
        deepFlat(fields)
            .filter((field) => !features || !field.features || field.features.some((feature) => features.includes(feature)))
            .forEach((f) => {
                if (isStatefull(f as IField)) {
                    create(obj, f.name);
                    if (typeof f.defaultValue === 'undefined') {
                        set(obj, f.name, get(obj, f.name) || initialValue(f.type));
                    } else if (typeof f.defaultValue === 'function') {
                        set(obj, f.name, (f.defaultValue as Function)(payload));
                    } else {
                        set(obj, f.name, f.defaultValue);
                    }
                }
            });
    }
    return obj;
};

/**
 * Хук разрешает обработчик на корневом уровне, при чем только
 * один раз. Для дочерних One компонентов осуществляется
 * подписка на изменения
 */
export const useResolved = <Data = IAnything, Payload = IAnything>({
    handler,
    fallback,
    fields,
    features,
    payload,
    change,
    loadStart,
    loadEnd,
}: IResolvedHookProps<Data, Payload>): [Data | null, (v: Data) => void] => {
    const [data, setData] = useState<Data | null>(null);
    const data$ = useActualValue(data);
    const { 
        apiRef, 
        changeSubject: upperChangeSubject,
        reloadSubject: upperReloadSubject,
        updateSubject: upperUpdateSubject,
    } = useApiRef();
    const isMounted = useRef(true);
    const isRoot = useRef(false);
    const changeSubject = useSubject(upperChangeSubject);
    const reloadSubject = useSubject(upperReloadSubject);
    const updateSubject = useSubject(upperUpdateSubject);
    useEffect(() => {
        const tryResolve = async () => {
            if (isRoot.current) {
                return
            } else if (typeof handler === 'function') {
                let isOk = true;
                loadStart && loadStart(LOAD_SOURCE);
                try {
                    const result = (handler as Function)(payload);
                    if (result instanceof Promise) {
                        const newData = assign({}, buildObj<Data>(fields, payload, features), deepClone(await result));
                        change!(newData, true);
                        isMounted.current && setData(newData);
                    } else {
                        const newData = assign({}, buildObj<Data>(fields, payload, features), deepClone(result));
                        change!(newData, true);
                        isMounted.current && setData(newData);
                    }
                } catch (e) {
                    isOk = false;
                    if (fallback) {
                        fallback(e as Error);
                    } else {
                        throw e;
                    }
                } finally {
                    loadEnd && loadEnd(isOk, LOAD_SOURCE);
                    isRoot.current = true;
                }
            } else if (handler && !deepCompare(data, handler)) {
                isMounted.current && setData(assign({}, buildObj(fields, payload, features), deepClone(handler)));
            }
        };
        const handleUpdateRef = () => {
            const instance: IOneApi<Data> = {
                reload: tryResolve,
                change: (data, initial = false) => {
                    setData(data);
                    change!(data, initial);
                },
                getData: () => ({...data$.current || ({} as Data)}),
            };
            if (typeof apiRef === 'function') {
                apiRef(instance);
            } else if (apiRef) {
                (apiRef.current as any) = instance;
            }
            reloadSubject.unsubscribeAll();
            reloadSubject.subscribe(instance.reload);
            changeSubject.unsubscribeAll();
            changeSubject.subscribe((data) => {
                if (data && data !== data$.current) {
                    instance.change(data, true);
                }
            });
            updateSubject.unsubscribeAll();
            updateSubject.subscribe((data) => {
                if (data && data !== data$.current) {
                    instance.change(data, false);
                }
            });
        };
        tryResolve();
        handleUpdateRef();
    }, [handler]);
    useLayoutEffect(() => () => {
        isMounted.current = false;
    }, []);
    return [data, setData];
};

export default useResolved;
