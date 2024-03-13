/**
 * Interface representing a subject that can be subscribed to and trigger callbacks when data is updated.
 *
 * @template Data - The type of data that the subject emits.
 */
export interface TSubject<Data = unknown> {
  subscribe: (callback: (data: Data) => void) => () => void;
  once: (callback: (data: Data) => void) => () => void;
  next: (data: Data) => void;
}

export default TSubject;
