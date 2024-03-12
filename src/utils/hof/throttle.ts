export interface IClearable {
    clear: () => void;
}

/**
 * Throttle function execution to a specific delay.
 * @template T - Function type
 * @param run - Function to be throttled
 * @param delay - Delay in milliseconds (default: 1000)
 * @returns - Throttled function with clear method
 */
export const throttle = <T extends (...args: any[]) => any>(run: T, delay = 1_000): T & IClearable => {
	let timeoutID: any;
	let cancelled = false;
	let lastExec = 0;
	const clearExistingTimeout = () => {
		if (timeoutID) {
			clearTimeout(timeoutID);
		}
	};
	const wrappedFn = (...args: any[]) => {
		let elapsed = Date.now() - lastExec;
		if (cancelled) {
			return;
		}
		const exec = () => {
			lastExec = Date.now();
			run(...args);
		};
		if (!timeoutID) {
			exec();
		}
		clearExistingTimeout();
		if (elapsed > delay) {
			exec();
		}
	};
	wrappedFn.clear = clearExistingTimeout;
    return wrappedFn as T & IClearable;
};

export default throttle;
