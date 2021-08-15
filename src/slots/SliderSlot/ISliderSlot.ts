import { ComponentType } from "react";

export interface ISliderSlot {
    value: number,
    onChange: (v: number) => void;
    leadingIcon?: string | ComponentType;
    trailingIcon?: string | ComponentType;
    leadingIconClick?: (value: any, onChange: (v: any) => void) => void;
    trailingIconClick?: (value: any, onChange: (v: any) => void) => void;
    stepSlider?: number;
    maxSlider?: number;
    minSlider?: number;
}

export default ISliderSlot;
