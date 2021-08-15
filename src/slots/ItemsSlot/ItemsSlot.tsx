import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IItemsSlot from './IItemsSlot';

export const ItemsSlot = (props: IItemsSlot) => {
    const { Combo } = useContext(SlotContext);
    return <Combo {...props} />;
};

export default ItemsSlot;
