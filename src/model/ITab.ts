import IOption from "./IOption";

export interface ITab extends Omit<IOption, keyof {
    action: never;
}> {
    value: string;
}

export default ITab;
