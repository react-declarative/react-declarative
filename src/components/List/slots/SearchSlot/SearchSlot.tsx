import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ISearchSlot from './ISearchSlot';

/**
 * Renders a SearchSlot component.
 *
 * @param props - The properties passed to the SearchSlot component.
 * @param props.SearchSlot - The SearchSlot component passed as a context.
 * @returns - The rendered SearchSlot component.
 */
export const SearchSlot = (props: ISearchSlot) => {
    const { SearchSlot } = useContext(SlotContext);
    return <SearchSlot {...props} />;
};

export default SearchSlot;
