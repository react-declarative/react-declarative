import * as React from 'react';

import { ISlotFactoryContext } from "../components/SlotFactory";

import DenseFilterListSlot from "../common/DenseFilterListSlot";
import DenseSearchSlot from '../common/DenseSearchSlot';

const Empty = () => <></>;

export const denceFilterRule: Partial<ISlotFactoryContext> = {
    FilterListSlot: DenseFilterListSlot,
    ActionListSlot: Empty,
    SearchSlot: DenseSearchSlot,
};

export default denceFilterRule;
