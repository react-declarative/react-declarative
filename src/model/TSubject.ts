export interface TSubject<Data = unknown> {
  subscribe: (callback: (data: Data) => void) => () => void;
  once: (callback: (data: Data) => void) => () => void;
  next: (data: Data) => void;
}

export default TSubject;
