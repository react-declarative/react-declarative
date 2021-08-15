import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITextSlot from './ITextSlot';

export const TypographySlot = (props: ITextSlot) => {
    const { Text } = useContext(SlotContext);
    return <Text {...props} />;
};

export default TypographySlot;
