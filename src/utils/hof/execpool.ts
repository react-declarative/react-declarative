import { execpool } from "functools-kit";
import type { IWrappedExecpoolFn } from "functools-kit";

export type IWrappedFn<T extends any = any, P extends any[] = any> = IWrappedExecpoolFn<T, P>;

export { execpool };

export default execpool;
