import { useRef, useState, useLayoutEffect } from 'react';

import IField from '../../../model/IField';

import initialValue from '../config/initialValue';
import isStatefull from '../config/isStatefull';

import deepCompare from '../../../utils/deepCompare';
import deepClone from '../../../utils/deepClone';
import deepFlat from '../../../utils/deepFlat';
import assign from '../../../utils/deepMerge';
import create from '../../../utils/create';

import objects from '../../../utils/objects';
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
    roles: PickProp<IOneProps<Data, Payload>, 'roles'>;
    change: PickProp<IOneProps<Data, Payload>, 'change'>;
    loadStart: PickProp<IOneProps<Data, Payload>, 'loadStart'>;
    loadEnd: PickProp<IOneProps<Data, Payload>, 'loadEnd'>;
}

const buildObj = <Data = IAnything>(fields: IField<Data>[], roles?: string[]) => {
    const obj = {};
    if (fields) {
        deepFlat(fields)
            .filter((field) => !roles || !field.roles || field.roles.find((role) => roles.includes(role)))
            .forEach((f) => {
                if (isStatefull(f as IField)) {
                    create(obj, f.name);
                    if (typeof f.defaultValue === 'undefined') {
                        set(obj, f.name, get(obj, f.name) || initialValue(f.type));
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
    roles,
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
    } = useApiRef();
    const isMounted = useRef(true);
    const isRoot = useRef(false);
    const changeSubject = useSubject(upperChangeSubject);
    const reloadSubject = useSubject(upperReloadSubject);
    useLayoutEffect(() => {
        const tryResolve = async () => {
            if (isRoot.current) {
                return
            } else if (typeof handler === 'function') {
                let isOk = true;
                loadStart && loadStart(LOAD_SOURCE);
                try {
                    const result = (handler as Function)(payload);
                    if (result instanceof Promise) {
                        const newData = objects(assign({}, buildObj<Data>(fields, roles), deepClone(await result)));
                        change!(newData, true);
                        isMounted.current && setData(newData);
                    } else {
                        const newData = objects(assign({}, buildObj<Data>(fields, roles), deepClone(result)));
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
                isMounted.current && setData(objects(assign({}, buildObj(fields, roles), handler)));
            }
        };
        const handleUpdateRef = () => {
            const instance: IOneApi<Data> = {
                reload: tryResolve,
                change: (data) => {
                    setData(data);
                    change!(data, true);
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
            changeSubject.subscribe(instance.change);
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
