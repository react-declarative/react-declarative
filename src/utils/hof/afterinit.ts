import { afterinit } from "functools-kit";
import type { IWrappedAfterInitFn } from "functools-kit";

export type IWrappedFn<T extends any = any, P extends any[] = any> = IWrappedAfterInitFn<T, P>;

export { afterinit };

export default afterinit;
