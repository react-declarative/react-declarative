export interface IRadioSlot {
    disabled: boolean;
    value: string;
    onChange: (v: string) => void;
    title?: string;
    radioValue?: string;
    name: string;
}

export default IRadioSlot;
