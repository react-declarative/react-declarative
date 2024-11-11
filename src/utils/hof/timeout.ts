import sleep from "../sleep";

const TIMEOUT_SYMBOL = Symbol('timeout');

export class TimeoutError extends Error {
}

export const timeout = async <T extends (...args: any[]) => any>(run: T, delay = 30_000): Promise<Awaited<T>> => {
  const result = await Promise.race([
    run(),
    sleep(delay).then(() => TIMEOUT_SYMBOL),
  ]);
  if (result === TIMEOUT_SYMBOL) {
    throw new TimeoutError('timeout exception');
  }
  return result;
}

export default timeout;
