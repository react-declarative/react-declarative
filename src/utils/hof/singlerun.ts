export interface IClearable {
    clear: () => void;
}

export class Task {
    private _status: "pending" | "fulfilled" | "rejected" = "pending";
    get status() {
        return this._status;
    };
    constructor(public readonly target: Promise<any>) {
        target.then(() => this._status = "fulfilled");
        target.catch(() => this._status = "rejected");
    };
};

export const singlerun = <T extends (...args: any[]) => any>(run: T): T & IClearable => {
    let result: Task | undefined = undefined;
    const fn = (...args: any) => {
        if (result?.status !== "pending") {
            result = new Task(run(...args));
        }
        return result?.target;
    };
    fn.clear = () => {
        result = undefined;
    };
    return fn as T & IClearable;
};

export default singlerun;
