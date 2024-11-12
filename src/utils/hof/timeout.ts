import sleep from "../sleep";

const TIMEOUT_SYMBOL = Symbol('timeout');

export class TimeoutError extends Error {
}

export const timeout = <T extends (...args: any[]) => any>(
  run: T,
  delay = 30_000
): T => {
  const wrappedFn = async (...args: any[]) => {
    const result = await Promise.race([
      run(...args),
      sleep(delay).then(() => TIMEOUT_SYMBOL),
    ]);
    if (result === TIMEOUT_SYMBOL) {
      throw new TimeoutError("timeout exception");
    }
    return result;
  };

  return wrappedFn as unknown as T;
};

export default timeout;
