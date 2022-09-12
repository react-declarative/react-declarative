import React, { useEffect, useState } from "react";

import Entity, { IEntity } from "../utils/mvvm/Entity";

import useActualValue from "./useActualValue";
import useEntity, { IParams as IEntityParams } from "./useEntity";

interface IParams<T extends IEntity = any> extends Omit<IEntityParams<T>, keyof {
    initialValue: never;
}> {
    creator: (entity: React.MutableRefObject<Entity<T>>, begin: () => void) => () => void;
    initialValue: T | Entity<T> | (() => T);
}

export const useEntityCreator = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue,
}: IParams<T>) => {

    const [loading, setLoading] = useState(false);

    const entity = useEntity({
        initialValue,
        onChange,
    });

    const entity$ = useActualValue(entity);

    useEffect(() => {
        return creator(entity$, () => {
            setLoading(true);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return entity;
    }

}

export default useEntityCreator;
