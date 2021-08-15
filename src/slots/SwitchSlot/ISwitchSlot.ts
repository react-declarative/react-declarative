export interface ISwitchSlot {
    disabled: boolean;
    value: boolean; 
    onChange: (v: boolean) => void;
    title?: string;
}

export default ISwitchSlot;
