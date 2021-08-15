export interface ICheckBoxSlot {
    disabled: boolean;
    value: boolean;
    onChange: (value: boolean) => void;
    title?: string;
}

export default ICheckBoxSlot;
