import IAnything from './IAnything';

/**
 * Represents a size with height and width dimensions.
 *
 * @interface
 */
export interface ISize {
  height: number;
  width: number;
}

export type ISizeCallback<Data = IAnything> = (data: Data, size: ISize, ref: HTMLDivElement) => string;

export default ISize;
