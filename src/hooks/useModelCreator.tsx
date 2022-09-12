import React, { useEffect, useState } from "react";

import Model from "../utils/mvvm/Model";

import useActualValue from "./useActualValue";
import useModel, { IParams as IModelParams } from "./useModel";

interface IParams<T extends {} = any> extends Omit<IModelParams<T>, keyof {
    initialValue: never;
}> {
    creator: (model: React.MutableRefObject<Model<T>>, begin: () => void) => (() => void) | void;
    initialValue?: T | Model<T> | (() => T);
}

export const useModelCreator = <T extends {} = any>({
    creator,
    onChange,
    initialValue = {} as T,
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const model = useModel({
        initialValue,
        onChange,
    });

    const model$ = useActualValue(model);

    useEffect(() => {
        return creator(model$, () => {
            model$.current.refresh();
            setLoading(false);
        });
    }, []);

    if (loading) {
        return null;
    } else {
        return model;
    }

}

export default useModelCreator;
