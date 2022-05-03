import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICheckBoxSlot from './ICheckBoxSlot';

export const CheckBoxSlot = (props: ICheckBoxSlot) => {
    const { CheckBox } = useContext(SlotContext);
    return <CheckBox {...props} />;
};

export default CheckBoxSlot;
