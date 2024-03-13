import { ISliderFieldPrivate, ISliderFieldProps } from "../../fields/SliderField";

/**
 * @interface
 * Represents a slider slot in a slider component.
 *
 * @extends {ISliderFieldProps} - Interface representing the properties of the slider field.
 * @extends {ISliderFieldPrivate} - Interface representing the private properties of the slider field.
 */
export interface ISliderSlot extends ISliderFieldProps, ISliderFieldPrivate { }

export default ISliderSlot;
