import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IItemsSlot from './IItemsSlot';

/**
 * Represents a component that provides a slot for items.
 * @param props - The component's properties.
 * @return The rendered component.
 */
export const ItemsSlot = (props: IItemsSlot) => {
    const { Items } = useContext(SlotContext);
    return <Items {...props} />;
};

export default ItemsSlot;
