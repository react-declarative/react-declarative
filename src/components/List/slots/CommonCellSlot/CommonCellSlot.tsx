import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ICommonCellSlot from './ICommonCellSlot';

export const CommonCellSlot = (props: ICommonCellSlot) => {
    const { CommonCell } = useContext(SlotContext);
    return <CommonCell {...props} />;
};

export default CommonCellSlot;
