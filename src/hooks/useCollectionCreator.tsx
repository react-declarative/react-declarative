import React, { useEffect, useState } from "react";

import Collection from "../utils/mvvm/Collection";
import Entity, { IEntity } from "../utils/mvvm/Entity";

import useActualValue from "./useActualValue";
import useCollection, { IParams as ICollectionParams } from "./useCollection";

interface IParams<T extends IEntity = any> extends Omit<ICollectionParams<T>, keyof {
    initialValue: never;
}> {
    creator: (collection: React.MutableRefObject<Collection<T>>, begin: () => void) => () => void;
    initialValue?: T[] | (() => T[]) | Entity<T>[] | Collection<T>;
}

export const useCollectionCreator = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue = [],
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const collection = useCollection({
        initialValue,
        onChange,
    });

    const collection$ = useActualValue(collection);

    useEffect(() => {
        return creator(collection$, () => {
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

export default useCollectionCreator;
