import { useEffect, useState, useRef } from "react";

import Subject from "../utils/rx/Subject";
import { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useCollection, { IParams as ICollectionParams, CollectionAdapter, CollectionEntityAdapter } from "./useCollection";
import useChangeSubject from "./useChangeSubject";
import useSingleton from "./useSingleton";
import useChange from "./useChange";

interface IParams<T extends IEntity = any> extends Omit<ICollectionParams<T>, keyof {
    initialValue: never;
    onChange: never;
}> {
    creator: (collection: CollectionAdapter<T>, change: Subject<CollectionAdapter<T>>, begin: () => void) => (() => void) | void;
    onChange?: (item: CollectionAdapter<T>, target: CollectionEntityAdapter<T> | null, initial: boolean) => void;
    initialValue?: T[] | (() => T[]);
}

export const useCollectionBinding = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue = [],
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);
    const initComplete = useRef(false);

    const handleChange = (item: CollectionAdapter<T>, target: CollectionEntityAdapter<T> | null) => onChange && onChange(item, target, !initComplete.current);

    const collection = useCollection({
        initialValue: initialValue as unknown as T[],
        onChange: handleChange,
        debounce,
    });

    const emit = useChangeSubject(collection);
    const change = useSingleton(() => new Subject<CollectionAdapter<T>>());

    useEffect(() => emit.subscribe((model) => {
        if (!loading && initComplete.current) {
            change.next(model);
        }
    }), [loading]);

    useChange(() => {
        if (!loading) {
            initComplete.current = true;
        }
    }, [collection]);

    useEffect(() => {
        return creator(collection, change, () => {
            collection.toCollection().handleDropChanges();
            collection.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return collection;
    }

};

export default useCollectionBinding;
