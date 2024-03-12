/**
 * Delays the execution for the specified amount of time.
 *
 * @param [timeout=1000] - The duration to wait in milliseconds.
 * @returns A promise that resolves once the timeout has elapsed.
 */
export const sleep = (timeout = 1000) => new Promise<void>((res) => setTimeout(() => res(), timeout));

export default sleep;
