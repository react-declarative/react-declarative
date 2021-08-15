export interface IItemsSlot {
    value: any;
    disabled: boolean;
    description?: string;
    placeholder?: string;
    outlined?: boolean;
    itemList?: any[];
    title?: string;
    dirty: boolean;
    invalid: string | null;
    tr?: (s: any) => string;
    onChange: (v: any) => void;
}

export default IItemsSlot;
