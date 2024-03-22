import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IActionMenuSlot from './IActionMenuSlot';

/**
 * Renders an action menu slot component.
 * @param props - The props for the action menu slot component
 * @returns - The rendered action menu slot component
 */
export const ActionMenuSlot = (props: IActionMenuSlot) => {
    const { ActionMenu } = useContext(SlotContext);
    return <ActionMenu {...props} />;
};

export default ActionMenuSlot;
