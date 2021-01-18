import { useRef, useState, useEffect } from 'react';

import IField from '../model/IField';

import initialValue from '../config/initialValue';
import isStatefull from '../config/isStatefull';

import deepCompare from '../utils/deepCompare';
import deepClone from '../utils/deepClone';
import deepFlat from '../utils/deepFlat';
import assign from '../utils/deepMerge';
import create from '../utils/create';
import set from '../utils/set';
import get from '../utils/get';

import IAnything from '../model/IAnything';

interface IResolvedHookProps {
    handler: (() => IAnything) | (() => Promise<IAnything>) | IAnything;
    fallback: (e: Error) => void;
    fields: IField[];
    change: (obj: IAnything, initial?: boolean) => void;
}

type useResolvedHook = (
    props: IResolvedHookProps
) => [IAnything | null, (v: IAnything) => void];

const buildObj = (fields: IField[]) => {
    const obj = {};
    if (fields) {
        deepFlat(fields, 'fields').forEach((f) => {
            if (isStatefull(f as IField)) {
                create(obj, f.name);
                const value = f.defaultValue || get(obj, f.name) || initialValue(f.type);
                set(obj, f.name, value);
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
export const useResolved: useResolvedHook = ({
    handler,
    fallback,
    fields,
    change,
}) => {
    const [data, setData] = useState<IAnything | null>(null);
    const isRoot = useRef(false);
    useEffect(() => {
        const tryResolve = async () => {
            if (isRoot.current) {
                return
            } else if (typeof handler === 'function') {
                try {
                    const result = handler();
                    if (result instanceof Promise) {
                        const newData = assign(buildObj(fields), deepClone(await result));
                        change(newData, true);
                        setData(newData);
                    } else {
                        const newData = assign(buildObj(fields), deepClone(result));
                        change(newData, true);
                        setData(newData);
                    }
                } catch (e) {
                    if (fallback) {
                        fallback(e);
                    } else {
                        throw e;
                    }
                } finally {
                    isRoot.current = true;
                }
            } else if (!deepCompare(data as IAnything, handler)) {
                setData(assign(buildObj(fields), handler));
            }
        };
        tryResolve();
    }, [handler]);
    return [data, setData];
};

export default useResolved;
