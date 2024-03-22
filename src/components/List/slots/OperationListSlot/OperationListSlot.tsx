import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IOperationListSlot from './IOperationListSlot';

/**
 * Represents a slot component for rendering an operation list.
 *
 * @component
 *
 * @param props - The props for the component.
 * @returns The rendered React node.
 */
export const OperationListSlot = (props: IOperationListSlot) => {
    const { OperationListSlot } = useContext(SlotContext);
    return <OperationListSlot {...props} />;
};

export default OperationListSlot;
