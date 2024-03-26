/**
 * Interface for classes that can be cleared.
 * @interface
 */
export interface IClearable {
    clear: () => void;
}

/**
 * A class representing a task.
 *
 * @class
 */
export class Task {
    private _status: "pending" | "fulfilled" | "rejected" = "pending";
    /**
     * Retrieves the current status value.
     *
     * @return The value of the status.
     */
    get status() {
        return this._status;
    };
    /**
     * Constructor for creating an instance of the class.
     *
     * @param target - The target promise to be handled.
     *
     * @return - This method does not return any value.
     */
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
    /**
     * Executes the given `run` function with the provided arguments and returns the result.
     *
     * If the `result` status is not "pending", a new `Task` is created with the `run` function.
     *
     * @param args - The arguments to be passed to the `run` function.
     * @returns - The target property of the `result` object, if available.
     */
    const fn = (...args: any) => {
        if (result?.status !== "pending") {
            result = new Task(run(...args));
        }
        return result?.target;
    };
    /**
     * Clears the content of the given input field.
     *
     * @param input - The input field to be cleared.
     * @returns
     */
    fn.clear = () => {
        result = undefined;
    };
    return fn as T & IClearable;
};

export default singlerun;
