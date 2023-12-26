import type IField from "./IField";

export type ComponentFieldInstance<Data = any, Payload = any> = Data & {
  onChange: (data: Partial<Data>) => void;
  _fieldData: Data;
  _fieldParams: IField;
  context: Record<string, any>;
  outlinePaper: boolean;
  payload: Payload;
  disabled: boolean;
  readonly: boolean;
  features: string[];
};

export type ComponentFieldInstanceProps = Omit<ComponentFieldInstance, keyof {
  context: never;
}> & {
  Element: React.ComponentType<ComponentFieldInstance>;
}

export default ComponentFieldInstance;
