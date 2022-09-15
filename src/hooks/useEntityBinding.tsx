import React, { useEffect, useState } from "react";

import Entity, { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";
import Subject from "../utils/rx/Subject";

import useActualValue from "./useActualValue";
import useChangeSubject from "./useChangeSubject";
import useEntity, { IParams as IEntityParams } from "./useEntity";

interface IParams<T extends IEntity = any> extends Omit<IEntityParams<T>, keyof {
    initialValue: never;
}> {
    creator: (entity: React.MutableRefObject<Entity<T>>, change: Subject<Entity<T>>, begin: () => void) => (() => void) | void;
    initialValue: Partial<T> | Entity<T> | (() => Partial<T>);
    debounce?: number;
}

export const useEntityBinding = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const entity = useEntity<T>({
        initialValue: initialValue as T,
        onChange,
        debounce,
    });

    const entity$ = useActualValue(entity);

    const subject = useChangeSubject(entity);

    useEffect(() => {
        return creator(entity$, subject, () => {
            entity$.current.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return entity;
    }

}

export default useEntityBinding;
