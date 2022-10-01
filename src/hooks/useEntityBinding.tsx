import { useEffect, useState, useRef } from "react";

import { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";
import Subject from "../utils/rx/Subject";

import useEntity, { IParams as IEntityParams, EntityAdapter } from "./useEntity";
import useChangeSubject from "./useChangeSubject";
import useSingleton from "./useSingleton";
import useChange from "./useChange";

interface IParams<T extends IEntity = any> extends Omit<IEntityParams<T>, keyof {
    initialValue: never;
    onChange: never;
}> {
    creator: (entity: EntityAdapter<T>, change: Subject<EntityAdapter<T>>, begin: () => void) => (() => void) | void;
    initialValue: Partial<T> | (() => Partial<T>);
    onChange?: (item: EntityAdapter<T>, initial: boolean) => void;
}

export const useEntityBinding = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);
    const initComplete = useRef(false);

    const handleChange = (item: EntityAdapter<T>) => onChange && onChange(item, !initComplete.current);

    const entity = useEntity<T>({
        initialValue: initialValue as T,
        onChange: handleChange,
        debounce,
    });

    const emit = useChangeSubject(entity);
    const change = useSingleton(() => new Subject<EntityAdapter<T>>());

    useEffect(() => emit.subscribe((model) => {
        if (!loading && initComplete.current) {
            change.next(model);
        }
    }), [loading]);

    useChange(() => {
        if (!loading) {
            initComplete.current = true;
        }
    }, [entity]);

    useEffect(() => {
        return creator(entity, change, () => {
            entity.toEntity().handleDropChanges();
            entity.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return entity;
    }

};

export default useEntityBinding;
