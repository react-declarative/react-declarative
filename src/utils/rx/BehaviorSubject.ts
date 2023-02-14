import Subject from "./Subject";

import TBehaviorSubject from "../../model/TBehaviorSubject";

export class BehaviorSubject<Data = any> extends Subject<Data> implements TBehaviorSubject<Data> {

    constructor(private _data: Data | null = null) {
        super();
    };

    get data() {
        return this._data;
    };

    public next = (data: Data) => {
        this._data = data;
        super.next(data);
    };

};

export { TBehaviorSubject };

export default BehaviorSubject;
