import { useEffect, useState } from "react";

import Subject from "../utils/rx/Subject";
import { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";

import useChangeSubject from "./useChangeSubject";
import useCollection, { IParams as ICollectionParams, CollectionAdapter } from "./useCollection";

interface IParams<T extends IEntity = any> extends Omit<ICollectionParams<T>, keyof {
    initialValue: never;
}> {
    creator: (collection: CollectionAdapter<T>, change: Subject<CollectionAdapter<T>>, begin: () => void) => (() => void) | void;
    initialValue?: T[] | (() => T[]);
}

export const useCollectionBinding = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue = [],
    debounce = CHANGE_DEBOUNCE
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const collection = useCollection({
        initialValue: initialValue as unknown as T[],
        onChange,
        debounce,
    });

    const subject = useChangeSubject(collection);

    useEffect(() => {
        return creator(collection, subject, () => {
            collection.refresh();
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
