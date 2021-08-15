import { ComponentType } from "react";

export interface ITextSlot {
    invalid: string | null;
    value: string;
    disabled: boolean;
    inputType?: string;
    description?: string;
    outlined?: boolean;
    title?: string;
    leadingIcon?: string | ComponentType;
    trailingIcon?: string | ComponentType;
    leadingIconClick?: (value: any, onChange: (v: any) => void) => void;
    trailingIconClick?: (value: any, onChange: (v: any) => void) => void;
    inputRows?: number;
    placeholder?: string;
    inputAutocomplete?: string;
    dirty: boolean;
    onChange: (v: string) => void;
    name: string;
}

export default ITextSlot;
