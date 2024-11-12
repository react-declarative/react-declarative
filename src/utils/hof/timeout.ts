import sleep from "../sleep";

export const TIMEOUT_SYMBOL = Symbol('timeout');

export const timeout = <T extends any = any, P extends any[] = any[]>(
  run: (...args: P) => Promise<T>,
  delay = 30_000
) => {
  const wrappedFn = async (...args: P) => {
    const result = await Promise.race([
      run(...args as P),
      sleep(delay).then(() => TIMEOUT_SYMBOL),
    ]);
    return result;
  };

  return wrappedFn;
};

export default timeout;
