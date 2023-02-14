import TSubject from "./TSubject";

export interface TBehaviorSubject<Data = unknown> extends TSubject<Data> {
  data: Data | null;
}

export default TBehaviorSubject;
