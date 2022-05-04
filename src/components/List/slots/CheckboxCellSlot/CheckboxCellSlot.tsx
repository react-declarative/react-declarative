import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICheckboxCellSlot from './ICheckboxCellSlot';

export const CheckboxCellSlot = (props: ICheckboxCellSlot) => {
    const { CheckboxCell } = useContext(SlotContext);
    return <CheckboxCell {...props} />;
};

export default CheckboxCellSlot;
