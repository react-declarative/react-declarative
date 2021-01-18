
/* eslint-disable @typescript-eslint/no-explicit-any */

export type IAnything<T extends object = object> = {
    [P in keyof T]: any;
} | any;

export default IAnything;
