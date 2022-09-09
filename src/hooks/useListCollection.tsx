import { useState, useEffect } from 'react';

import Collection from "../utils/mvvm/Collection";

import { IEntity } from "../utils/mvvm/Entity";

export const useListCollection = <T extends IEntity>(initialValue: T[] = []) => {
    const [collection, setCollection] = useState(() => new Collection(initialValue));
    useEffect(() => collection.handleChange((collection) => setCollection(collection)), [collection]);
    return collection;
};

export default useListCollection;
