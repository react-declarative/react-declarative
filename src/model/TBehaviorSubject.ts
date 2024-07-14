import type TSubject from "./TSubject";

/**
 * Represents a behavior subject.
 * @template Data The type of data that the behavior subject holds.
 * @extends TSubject<Data>
 * @interface
 */
export interface TBehaviorSubject<Data = unknown> extends TSubject<Data> {
  data: Data | null;
}

export default TBehaviorSubject;
