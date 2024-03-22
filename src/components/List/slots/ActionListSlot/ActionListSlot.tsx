import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionListSlot from './IActionListSlot';

/**
 * Function component representing an action list slot.
 * @param props - The properties for the action list slot.
 * @returns - The rendered action list slot.
 */
export const ActionListSlot = (props: IActionListSlot) => {
    const { ActionListSlot } = useContext(SlotContext);
    return <ActionListSlot {...props} />;
};

export default ActionListSlot;
