export interface IClearable {
    clear: () => void;
}

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
