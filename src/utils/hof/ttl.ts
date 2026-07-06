import { ttl } from "functools-kit";
import type { IClearableTtl } from "functools-kit";

export type IClearable<K = string> = IClearableTtl<K>;

export { ttl };

export default ttl;
