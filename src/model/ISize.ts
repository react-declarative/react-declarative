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

/**
 * Type definition for a callback function that handles size and data changes.
 *
 * @template Data - The type of data being passed to the callback function.
 * @param data - The data being passed to the callback function.
 * @param size - The size information.
 * @param ref - The reference to the HTML div element.
 * @returns A string representing the result of the callback function.
 */
export type ISizeCallback<Data = IAnything> = (data: Data, size: ISize, ref: HTMLDivElement) => string;

export default ISize;
