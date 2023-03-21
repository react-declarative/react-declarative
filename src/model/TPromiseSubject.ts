import TSubject from "./TSubject";

export interface TPromiseSubject<Data = unknown> extends TSubject<Data> {
  cancel(): void;
}

export default TPromiseSubject;
