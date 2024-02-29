import type IField from "./IField";
import type IManaged from "./IManaged";

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

export interface IDebug<Data = any, Payload = any> {
  originalComponent: React.ComponentType<IManaged<Data>>;
  managedProps: IManaged<Data>;
  payload: Payload;
}

export type ComponentFieldInstanceProps = Omit<ComponentFieldInstance, keyof {
  context: never;
}> & {
  Element: React.ComponentType<ComponentFieldInstance>;
}

export default ComponentFieldInstance;
