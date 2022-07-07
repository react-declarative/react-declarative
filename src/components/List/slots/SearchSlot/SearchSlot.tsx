import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ISearchSlot from './ISearchSlot';

export const SearchSlot = (props: ISearchSlot) => {
    const { SearchSlot } = useContext(SlotContext);
    return <SearchSlot {...props} />;
};

export default SearchSlot;
