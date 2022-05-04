import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import IBodyRowSlot from './IBodyRowSlot';

export const BodyRowSlot = (props: IBodyRowSlot) => {
    const { BodyRow } = useContext(SlotContext);
    return <BodyRow {...props} />;
};

export default BodyRowSlot;
