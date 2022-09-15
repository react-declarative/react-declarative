import React, { useEffect, useState } from "react";

import Subject from "../utils/rx/Subject";
import Collection from "../utils/mvvm/Collection";
import Entity, { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useActualValue from "./useActualValue";
import useChangeSubject from "./useChangeSubject";
import useCollection, { IParams as ICollectionParams } from "./useCollection";

interface IParams<T extends IEntity = any> extends Omit<ICollectionParams<T>, keyof {
    initialValue: never;
}> {
    creator: (collection: React.MutableRefObject<Collection<T>>, change: Subject<Collection<T>>, begin: () => void) => (() => void) | void;
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
}

export const useCollectionBinding = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue = [],
    debounce = CHANGE_DEBOUNCE
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const collection = useCollection({
        initialValue,
        onChange,
        debounce,
    });

    const collection$ = useActualValue(collection);

    const subject = useChangeSubject(collection);

    useEffect(() => {
        return creator(collection$, subject, () => {
            collection$.current.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return collection;
    }

}

export default useCollectionBinding;
