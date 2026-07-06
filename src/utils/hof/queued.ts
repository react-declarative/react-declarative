import { queued, CANCELED_PROMISE_SYMBOL } from "functools-kit";
import type { IWrappedQueuedFn } from "functools-kit";

export type IWrappedFn<T extends any = any, P extends any[] = any> = IWrappedQueuedFn<T, P>;

export { CANCELED_PROMISE_SYMBOL as CANCELED_SYMBOL };

export { queued };

export default queued;
