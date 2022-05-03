import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ISliderSlot from './ISliderSlot';

export const SliderSlot = (props: ISliderSlot) => {
    const { Slider } = useContext(SlotContext);
    return <Slider {...props} />;
};

export default SliderSlot;
