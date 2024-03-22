import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICommonCellSlot from './ICommonCellSlot';

/**
 * Represents a common cell slot component.
 *
 * @param props - The props object containing the required data for the component.
 * @returns - The rendered CommonCell component.
 */
export const CommonCellSlot = (props: ICommonCellSlot) => {
    const { CommonCell } = useContext(SlotContext);
    return <CommonCell {...props} />;
};

export default CommonCellSlot;
