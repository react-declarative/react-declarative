import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IFilterListSlot from './IFilterListSlot';

export const FilterListSlot = (props: IFilterListSlot) => {
    const { FilterListSlot } = useContext(SlotContext);
    return <FilterListSlot {...props} />;
};

export default FilterListSlot;
