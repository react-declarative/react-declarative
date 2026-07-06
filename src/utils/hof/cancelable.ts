import { cancelable, CANCELED_PROMISE_SYMBOL } from "functools-kit";
import type { IWrappedCancelableFn } from "functools-kit";

export type IWrappedFn<T extends any = any, P extends any[] = any> = IWrappedCancelableFn<T, P>;

export { CANCELED_PROMISE_SYMBOL as CANCELED_SYMBOL };

export { cancelable };

export default cancelable;
