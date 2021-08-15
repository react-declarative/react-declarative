export interface IRatingSlot {
    value: number | null;
    disabled: boolean;
    readonly?: boolean;
    title?: string;
    name?: string;
    onChange: (v: number | null) => void;
}

export default IRatingSlot;
