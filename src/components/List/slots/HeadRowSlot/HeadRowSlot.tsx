import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IHeadRowSlot from './IHeadRowSlot';

export const HeadRowSlot = (props: IHeadRowSlot) => {
    const { HeadRow } = useContext(SlotContext);
    return <HeadRow {...props} />;
};

export default HeadRowSlot;
