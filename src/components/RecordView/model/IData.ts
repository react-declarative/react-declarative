export type Value = boolean | number | string;

export interface IData {
  [key: string]: IData | Value;
}

export default IData;
