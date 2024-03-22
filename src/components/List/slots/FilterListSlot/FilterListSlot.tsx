import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IFilterListSlot from './IFilterListSlot';

/**
 * A component that renders a slot for a filter list.
 *
 * @param props - The props for the component.
 * @param props - The context object for the filter list slot.
 *
 * @returns The rendered filter list slot component.
 */
export const FilterListSlot = (props: IFilterListSlot) => {
    const { FilterListSlot } = useContext(SlotContext);
    return <FilterListSlot {...props} />;
};

export default FilterListSlot;
