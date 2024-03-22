import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionAddSlot from './IActionAddSlot';

/**
 * ActionAddSlot function.
 *
 * @param props - Props object for the ActionAddSlot component.
 * @returns - ActionAdd component with the given props.
 */
export const ActionAddSlot = (props: IActionAddSlot) => {
    const { ActionAdd } = useContext(SlotContext);
    return <ActionAdd {...props} />;
};

export default ActionAddSlot;
