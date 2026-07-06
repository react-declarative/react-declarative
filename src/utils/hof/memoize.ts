import { memoize } from "functools-kit";
import type { IClearableMemoize, IControlMemoize, IRefMemoize } from "functools-kit";

export type IClearable<K = string> = IClearableMemoize<K>;
export type IRef<T = any> = IRefMemoize<T>;
export type IControl<K, V> = IControlMemoize<K, V>;

export { memoize };

export default memoize;
