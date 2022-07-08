import React, { useState, useMemo, useEffect, useRef, Fragment } from "react";

type RowId = number;

export const useListEditor = <Data extends any = undefined>(renderItem: (id: RowId, item: Data) => React.ReactElement, {
    initialValue = [],
    onChange,
}: {
    initialValue?: Data[],
    onChange?: (items: Data[]) => void;
}) => {

    const [items, setItems] = useState(new Map<RowId, Data>(initialValue.map((item, idx) => [idx, item])));

    const initialChange = useRef(true);

    const createId = () => Math.max(...items.keys(), 0) + 1;

    const onAddItem = (data: Data) => {
        const id = createId();
        items.set(id, data);
        setItems(new Map(items));
    };

    const onRemoveItem = (id: RowId) => {
        items.delete(id);
        setItems(new Map(items));
    };

    const onUpdateItem = (id: RowId, data: Data) => {
        items.set(id, data);
        setItems(new Map(items));
    };

    const itemList = useMemo(() => [...items.values()], [items]);

    useEffect(() => {
        if (initialChange.current) {
            initialChange.current = false;
            return;
        }
        onChange && onChange(itemList);
    }, [itemList]);

    const render = () => (
        <>
            {[...items.entries()].map(([id, item], idx) => (
                <Fragment key={idx}>
                    {renderItem(id, item)}
                </Fragment>
            ))}
        </>
    );

    return {
        onAddItem,
        onUpdateItem,
        onRemoveItem,
        items: itemList,
        render,
    };
};

export default useListEditor;
