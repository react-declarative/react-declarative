export interface IActionAddSlot {
    action?: string;
    isVisible?: () => Promise<boolean> | boolean;
    isDisabled?: () => Promise<boolean> | boolean;
}

export default IActionAddSlot;
