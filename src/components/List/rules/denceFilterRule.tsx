import * as React from 'react';

import { ISlotFactoryContext } from "../components/SlotFactory";

import DenseFilterListSlot from "../common/DenseFilterListSlot";

const Empty = () => <></>;

export const denceFilterRule: Partial<ISlotFactoryContext> = {
    FilterListSlot: DenseFilterListSlot,
    ActionListSlot: Empty,
};

export default denceFilterRule;
