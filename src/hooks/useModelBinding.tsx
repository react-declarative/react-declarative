import React, { useEffect, useState } from "react";

import Model from "../utils/mvvm/Model";

import useActualValue from "./useActualValue";
import useModel, { IParams as IModelParams } from "./useModel";

interface IParams<T extends {} = any> extends Omit<IModelParams<T>, keyof {
    initialValue: never;
}> {
    creator: (model: React.MutableRefObject<Model<T>>, begin: () => void) => (() => void) | void;
    initialValue?: Partial<T> | Model<T> | (() => Partial<T>);
}

export const useModelBinding = <T extends {} = any>({
    creator,
    onChange,
    initialValue = {},
}: IParams<T>) => {

    const [loading, setLoading] = useState(true);

    const model = useModel<T>({
        initialValue: initialValue as T,
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

export default useModelBinding;
