import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IItemsSlot from './IItemsSlot';

export const ItemsSlot = (props: IItemsSlot) => {
    const { Items } = useContext(SlotContext);
    return <Items {...props} />;
};

export default ItemsSlot;
