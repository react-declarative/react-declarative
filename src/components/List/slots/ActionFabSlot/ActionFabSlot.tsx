import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionFabSlot from './IActionFabSlot';

/**
 * Represents a component that renders an action floating action button slot.
 * @param props - The props for the action floating action button slot.
 * @returns - The rendered action floating action button slot.
 */
export const ActionFabSlot = (props: IActionFabSlot) => {
    const { ActionFab } = useContext(SlotContext);
    return <ActionFab {...props} />;
};

export default ActionFabSlot;
