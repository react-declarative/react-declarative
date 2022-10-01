import Subject from "./Subject";

export class BehaviorSubject<Data = any> extends Subject<Data> {

    private _data: Data | null = null;

    get data() {
        return this._data;
    };

    public next = (data: Data) => {
        this._data = data;
        super.next(data);
    };

};

export default BehaviorSubject;
