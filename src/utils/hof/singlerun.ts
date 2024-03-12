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

/**
 * Represents a higher-order function that runs a task only once and provides a way to clear the result.
 * @template T - The function type.
 * @param run - The function to be executed.
 * @returns - The wrapped function with additional clear functionality.
 */
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
