import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ITypographySlot from './ITypographySlot';

export const TypographySlot = (props: ITypographySlot) => {
    const { Typography } = useContext(SlotContext);
    return <Typography {...props} />;
};

export default TypographySlot;
