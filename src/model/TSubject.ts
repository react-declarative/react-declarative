/**
 * Interface representing a subject that can be subscribed to and trigger callbacks when data is updated.
 *
 * @template Data - The type of data that the subject emits.
 */
export interface TSubject<Data = unknown> {
  /**
   * Subscribe to receive data updates.
   *
   * @param {Function} callback - The callback function to be called when data is received.
   *                             It takes a single parameter, `data`, of type `Data`.
   *                             The callback function is expected to have a `void` return type.
   *
   * @returns {Function} - The unsubscribe function. Call this function to stop receiving data updates.
   *                      It has a `void` return type.
   *
   * @typedef {Object} Data - The data received by the callback function.
   * @property {*} [property1] - The first property of the data.
   * @property {*} [property2] - The second property of the data.
   * @property {*} [property3] - The third property of the data.
   */
  subscribe: (callback: (data: Data) => void) => () => void;
  /**
   * Executes the provided callback function once, and returns a cleanup function.
   *
   * @param {Function} callback - A callback function to be executed once.
   *                            - The callback function is expected to take one argument of type Data and have no return value.
   *
   * @returns {Function} - A cleanup function that can be executed to cancel any pending or ongoing execution of the callback.
   */
  once: (callback: (data: Data) => void) => () => void;
  /**
   * Executes the next function with the provided data.
   *
   * @param {Data} data - The data to be passed to the next function.
   * @returns {void}
   */
  next: (data: Data) => void;
}

export default TSubject;
