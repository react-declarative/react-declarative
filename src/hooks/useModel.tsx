import { useState, useEffect } from 'react';

import Model, { REFRESH_SYMBOL } from "../utils/mvvm/Model";

import useActualCallback from './useActualCallback';

interface IParams<T extends {} = any> {
    initialValue: T | Model<T> | (() => T);
    onChange?: (item: Model<T>) => void;
}

export const useModel = <T extends {} = any>({
    initialValue,
    onChange = () => null,
}: IParams<T>) => {
    const [model, setModel] = useState(() => new Model(initialValue));
    const handleChange = useActualCallback(onChange);
    useEffect(() => model.handleChange((model) => {
        const newModel = new Model(model);
        setModel(newModel);
        handleChange(newModel);
    }), [model]);
    useEffect(() => model.once(REFRESH_SYMBOL, () => {
        setModel(new Model(model));
    }), [model]);
    return model;
};

export default useModel;
