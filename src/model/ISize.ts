import IAnything from './IAnything';

export interface ISize {
  height: number;
  width: number;
}

export type ISizeCallback<Data = IAnything> = (data: Data, size: ISize) => string;

export default ISize;
