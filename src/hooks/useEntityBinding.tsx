import { useEffect, useState, useRef } from "react";

import { IEntity, CHANGE_DEBOUNCE } from "../utils/mvvm/Entity";
import Subject from "../utils/rx/Subject";

import useEntity, { IParams as IEntityParams, EntityAdapter } from "./useEntity";
import useChangeSubject from "./useChangeSubject";
import useSingleton from "./useSingleton";
import useChange from "./useChange";

/**
 * Represents the parameters for a class.
 * @template T - The type of entity.
 */
interface IParams<T extends IEntity = any> extends Omit<IEntityParams<T>, keyof {
    initialValue: never;
    onChange: never;
}> {
    creator: (entity: EntityAdapter<T>, change: Subject<EntityAdapter<T>>, begin: () => void) => (() => void) | void;
    initialValue: Partial<T> | (() => Partial<T>);
    onChange?: (item: EntityAdapter<T>, initial: boolean) => void;
}

/**
 * Custom hook to bind an entity to its creator and handle change events.
 *
 * @template T - The type of the entity.
 * @param params - The parameters object.
 * @param params.creator - The function to create the entity.
 * @param params.onChange - The function to handle entity change events.
 * @param params.initialValue - The initial value of the entity.
 * @param [params.debounce=CHANGE_DEBOUNCE] - The debounce time for entity changes.
 * @returns - The entity or null if still loading.
 */
export const useEntityBinding = <T extends IEntity = any>({
    creator,
    onChange,
    initialValue,
    debounce = CHANGE_DEBOUNCE,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);
    const initComplete = useRef(false);

    /**
     * @function handleChange
     * @description Handles the change event for a given item.
     *
     * @param item - The item to handle change for.
     * @returns
     */
    const handleChange = (item: EntityAdapter<T>) => onChange && onChange(item, !initComplete.current);

    /**
     * Initializes an entity with the provided initial value and change handler.
     *
     * @template T - The type of value for the entity.
     * @param options - The options for initializing the entity.
     * @param options.initialValue - The initial value of the entity.
     * @param options.onChange - The change handler function for the entity.
     * @param [options.debounce] - The debounce time in milliseconds for the onChange function. Defaults to `null`.
     * @returns - The entity with the provided initial value and change handler.
     */
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
