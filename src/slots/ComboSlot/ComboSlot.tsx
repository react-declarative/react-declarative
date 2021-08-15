import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IComboSlot from './IComboSlot';

export const ComboSlot = (props: IComboSlot) => {
    const { Combo } = useContext(SlotContext);
    return <Combo {...props} />;
};

export default ComboSlot;
