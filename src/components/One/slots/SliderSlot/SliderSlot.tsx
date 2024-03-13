import * as React from 'react';
import { useContext } from 'react';

import { SlotContext } from '../../components/SlotFactory';

import ISliderSlot from './ISliderSlot';

/**
 * Represents a Slider component wrapped in a SlotContext.
 *
 * @param props - The props object that contains the properties for the Slider component.
 * @returns The Slider component with the given props.
 */
export const SliderSlot = (props: ISliderSlot) => {
    const { Slider } = useContext(SlotContext);
    return <Slider {...props} />;
};

export default SliderSlot;
