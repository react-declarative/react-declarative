import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionListSlot from './IActionListSlot';

export const ActionListSlot = (props: IActionListSlot) => {
    const { ActionListSlot } = useContext(SlotContext);
    return <ActionListSlot {...props} />;
};

export default ActionListSlot;
