import React, { useState, useMemo, useEffect, useRef, Fragment } from "react";

type RowId = number;

/**
 * Creates a list editor that allows adding, updating, and removing items.
 *
 * @template Data - The type of data for each item in the list.
 * @param {(id: RowId, item: Data) => React.ReactElement} renderItem - The function that renders each item in the list.
 * @param {Object} options - The options for the list editor.
 * @param {Data[]} [options.initialValue=[]] - The initial list of items.
 * @param {(items: Data[]) => void} [options.onChange] - The callback function called when the list of items changes.
 * @returns {Object} An object with the following properties and methods:
 *   - onAddItem: a function that adds a new item to the list.
 *   - onUpdateItem: a function that updates an item in the list.
 *   - onRemoveItem: a function that removes an item from the list.
 *   - items: an array of the current items in the list.
 *   - render: a function that renders the list of items.
 */
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
        return id;
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
