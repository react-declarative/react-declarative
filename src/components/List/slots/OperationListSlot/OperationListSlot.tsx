import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IOperationListSlot from './IOperationListSlot';

export const OperationListSlot = (props: IOperationListSlot) => {
    const { OperationListSlot } = useContext(SlotContext);
    return <OperationListSlot {...props} />;
};

export default OperationListSlot;
