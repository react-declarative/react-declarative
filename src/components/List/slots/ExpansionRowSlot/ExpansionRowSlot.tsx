import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IExpansionRowSlot from './IExpansionRowSlot';

export const ExpansionRowSlot = (props: IExpansionRowSlot) => {
    const { ExpansionRow } = useContext(SlotContext);
    return <ExpansionRow {...props} />;
};

export default ExpansionRowSlot;
