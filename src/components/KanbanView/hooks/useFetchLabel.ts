import createValueProvider from "../../../utils/createValueProvider";

/**
 * Represents a function that takes an `id` and a `fn` and returns a `ReactNode` or a `Promise` that resolves to a `ReactNode`.
 * It also provides methods for clearing the cache by `id` and for garbage collection.
 */
interface Fn {
  (id: string, fn: () => React.ReactNode | Promise<React.ReactNode>): (React.ReactNode | Promise<React.ReactNode>);
  clear(id?: any): void;
  gc(): void;
}

export const [FetchLabelProvider, useFetchLabel] = createValueProvider<Fn>();

export default useFetchLabel;
