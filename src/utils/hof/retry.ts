import { retry } from "functools-kit";
import type { IWrappedRetryFn } from "functools-kit";

export type IWrappedFn<T extends any = any, P extends any[] = any> = IWrappedRetryFn<T, P>;

export { retry };

export default retry;
