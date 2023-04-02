import TSubject from "./TSubject";

export interface TCancelableSubject<Data = unknown> extends TSubject<Data> {
  cancel(): void;
}

export default TCancelableSubject;
