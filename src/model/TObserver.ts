/**
 * TObserver is an interface that represents an observable object.
 * It provides various methods to transform, filter, merge, and consume data emitted by the observable.
 *
 * @template Data - The type of data emitted by the observable.
 */
export interface TObserver<Data = unknown> {
    /**
     * Unsubscribe Function
     *
     * @returns
     */
    unsubscribe: () => void;
    /**
     * Applies a callback function to each value in a map and returns an observer for the result.
     *
     * @template T - The generic type of the result
     * @param callbackfn - The callback function to be applied to each value
     * @returns - An observer for the result of the callback function
     */
    map: <T = unknown>(callbackfn: (value: Data) => T) => TObserver<T>;
    /**
     * Applies a callback function to each element of the Data array and flattens the result into a single array.
     *
     * @template T - The type of elements in the result array.
     * @param callbackfn - A function that transforms each element of the Data array into an array of values.
     * @returns - An observer that emits the flattened array of transformed values.
     */
    flatMap: <T = any>(callbackfn: (value: Data) => T[])=> TObserver<T>;
    /**
     * Represents a function to reduce the data in an array-like structure.
     *
     * @template T - The type of the accumulator and current value.
     * @param callbackfn - A function that accepts the accumulator (acm) and the current value (cur), and returns the new accumulator value.
     * @param begin - The initial value of the accumulator.
     * @returns - Returns a TObserver object to observe the reduced value.
     */
    reduce: <T = any>(callbackfn: (acm: T, cur: Data) => T, begin: T) => TObserver<T>;
    /**
     * Asynchronously applies a callback function to each element of the data stream and returns a TObserver<T> object.
     *
     * @template T - The type of the result returned by the callback function.
     * @param callbackfn - The callback function to apply to each element of the data stream.
     * @param [fallbackfn] - Optional fallback function to handle any errors that occur during the mapping process.
     * @returns - The observer object that can be used to subscribe and handle the mapped data stream.
     */
    mapAsync: <T = unknown>(callbackfn: (value: Data) => Promise<T>, fallbackfn?: (e: Error) => void) => TObserver<T>;
    /**
     * @template T - The type of the target observer
     * @param callbackfn - The callback function to be executed
     * @returns - The observer of type T
     */
    operator: <T = any>(callbackfn: (target: TObserver<Data>) => TObserver<T>) => TObserver<T>;
    /**
     * Creates a filtered observer that applies a callback function to each value emitted by the source observer and only emits the values for which the callback returns true.
     *
     * @param callbackfn - A function called for each value emitted by the source observer. Should return true to include the value in the filtered observer
     *, or false otherwise.
     * @returns A new observer that only emits values for which the callback returns true.
     */
    filter: (callbackfn: (value: Data) => boolean) => TObserver<Data>;
    /**
     * Merges the provided observer with another observer of type T, returning a new observer that emits values
     * of type `Data | T`.
     *
     * @template T - The type of the observer to merge with.
     * @param observer - The observer to merge with.
     * @returns - The merged observer.
     */
    merge: <T = unknown>(observer: TObserver<T>) => TObserver<Data | T>;
    /**
     * Represents a tap function that takes a callback function to be executed.
     *
     * @param callbackfn - The callback function to be executed.
     * @returns - The observer used for subscribing to the tap function.
     *
     * @template Data - The type of data that the callback function takes as input.
     */
    tap: (callbackfn: (value: Data) => void) => TObserver<Data>;
    /**
     * Represents a function that splits an array into multiple arrays of a specified length.
     *
     * @returns An observer that emits an array of arrays where each subarray contains a maximum of 20 elements.
     */
    split: () => TObserver<ReadonlyArray<FlatArray<Data[], 20>>>;
    /**
     * Creates a debounced observer with optional delay.
     *
     * @param [delay] - The delay in milliseconds before emitting the observation.
     * @returns - The debounced observer.
     */
    debounce: (delay?: number) => TObserver<Data>;
    /**
     * A function that returns an observer with optional interval.
     *
     * @param [interval] - The optional interval in milliseconds.
     * @returns - An observer.
     */
    repeat: (interval?: number) => TObserver<Data>;
    /**
     * Represents a connection with a callback function.
     * @typicalname connect
     *
     * @param callbackfn - The callback function to be executed when a value is received.
     * @param value - The value received by the callback function.
     * @returns - A function that can be used to disconnect the connection.
     */
    connect: (callbackfn: (value: Data) => void) => () => void;
    /**
     * Executes a given callback function once and returns a function that can be used to cancel the execution.
     *
     * @param callbackfn - The callback function to execute once.
     * @returns - A function that can be used to cancel the execution of the callback function.
     */
    once: (callbackfn: (value: Data) => void) => () => void;
    /**
     * Represents a function that returns a TObserver object.
     *
     * @typedef share
     * @returns The TObserver object
     */
    share: () => TObserver<Data>;
    /**
     * Converts the given value to a Promise with the specified data type.
     *
     * @function toPromise
     * @returns A Promise with the specified data type.
     */
    toPromise: () => Promise<Data>;
    /**
     * Represents an iterator context.
     *
     * @interface
     */
    toIteratorContext: () => {
        iterate(): AsyncGenerator<Data, void, unknown>;
        done(): void;
    };
}

/**
 * Represents an observable class that can be used to observe changes in data.
 * @template Data - The type of data that the observable emits.
 */
export type TObservable<Data = unknown> = Omit<TObserver<Data>, keyof {
    unsubscribe: never;
    connect: never;
    once: never;
    share: never;
}>;

export default TObserver;
