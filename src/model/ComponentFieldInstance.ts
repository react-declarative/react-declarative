import type IField from "./IField";
import type IManaged from "./IManaged";

/**
 * Represents parameters for a component field element callback.
 * @template Data - The data type of the field.
 * @template Payload - The payload type of the field.
 */
export type ComponentFieldInstance<Data = any, Payload = any> = Data & {
  /**
   * A callback function type that is called when a change event occurs.
   *
   * @callback onChange
   * @param data - The partial data that has changed.
   * @returns
   */
  onChange: (data: Partial<Data>) => void;
  /**
   * Callback function to handle the change event of a managed data object.
   *
   * @callback onValueChange
   * @memberof IManaged
   * @template Data - The type of data managed by the object.
   * @template Payload - The type of payload passed to the change event handler.
   * @param data - The updated data after the change.
   * @param payload - The payload passed to the change event handler.
   * @returns
   */
  onValueChange: IManaged<Data, Payload>['onChange'];
  /**
   * Represents the field data.
   *
   * @typedef FieldData
   * @property data - The data object.
   */
  _fieldData: Data;
  /**
   * Represents a field parameter for a particular field.
   *
   * @typedef IField
   * @property name - The name of the field.
   * @property type - The data type of the field.
   * @property required - Indicates if the field is required.
   * @property length - The maximum length of the field value.
   */
  _fieldParams: IField;
  /**
   * Represents the context variable.
   *
   * @typedef Context
   */
  context: Record<string, any>;
  /**
   * Represents whether an outline paper is present.
   *
   * @type {boolean}
   */
  outlinePaper: boolean;
  /**
   * Represents whether the paper is transparent.
   *
   * @type {boolean}
   */
  transparentPaper: boolean;
  /**
   * Represents a payload object.
   *
   * @class
   * @classdesc This class represents a payload object that can be used to send data between systems.
   */
  payload: Payload;
  /**
   * Represents the state of disablement.
   *
   * @typedef Disabled
   */
  disabled: boolean;
  /**
   * Indicates whether a variable is read-only or not.
   *
   * @type {boolean}
   */
  readonly: boolean;
  /**
   * The 'incorrect' property of IManaged<Data, Payload> interface represents the incorrect value of a managed data object.
   *
   * @template Data - The type of the managed data object.
   * @template Payload - The type of data payload that represents the incorrect value.
   *
   * @type {Payload}
   */
  incorrect: IManaged<Data, Payload>['incorrect'];
  /**
   * Represents the `invalid` property of the `IManaged` interface.
   *
   * This property stores the invalid state of a managed object in relation to
   * its data and payload types.
   *
   * @template Data - The data type of the managed object.
   * @template Payload - The payload type of the managed object.
   *
   * @type {boolean}
   */
  invalid: IManaged<Data, Payload>['invalid'];
  value: IManaged<Data, Payload>['value'];
  features: string[];
  onClick: (e: React.MouseEvent<any>) => void | Promise<void>;
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
