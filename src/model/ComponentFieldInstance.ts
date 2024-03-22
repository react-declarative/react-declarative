import type IField from "./IField";
import type IManaged from "./IManaged";

/**
 * Represents parameters for a component field element callback.
 * @template Data - The data type of the field.
 * @template Payload - The payload type of the field.
 */
export type ComponentFieldInstance<Data = any, Payload = any> = Data & {
  onChange: (data: Partial<Data>) => void;
  onValueChange: IManaged<Data, Payload>['onChange'];
  _fieldData: Data;
  _fieldParams: IField;
  context: Record<string, any>;
  outlinePaper: boolean;
  transparentPaper: boolean;
  payload: Payload;
  disabled: boolean;
  readonly: boolean;
  incorrect: IManaged<Data, Payload>['incorrect'];
  invalid: IManaged<Data, Payload>['invalid'];
  features: string[];
};

/**
 * Interface representing a debug object.
 */
export interface IDebug<Data = any, Payload = any> {
  originalComponent: React.ComponentType<IManaged<Data>>;
  managedProps: IManaged<Data>;
  payload: Payload;
}

/**
 * Represents the props for a specific instance of a component field.
 */
export type ComponentFieldInstanceProps = Omit<ComponentFieldInstance, keyof {
  context: never;
}> & {
  Element: React.ComponentType<ComponentFieldInstance>;
}

export default ComponentFieldInstance;
