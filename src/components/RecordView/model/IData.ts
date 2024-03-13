export type Value = boolean | number | string;

/**
 * Represents a data structure that can hold various types of data.
 */
export interface IData {
  [key: string]: IData[] | Value[] | IData | Value;
}

export default IData;
