import { TObserver } from "../Observer";

/**
 * Applies stride tricks to a given target observer.
 * @template T The type of elements in the target observer.
 * @param strideSize The size of each stride.
 * @param [step=Math.floor(strideSize / 2)] The step size between each stride.
 * @returns The transformed observer that emits strided data.
 * @throws If the strideSize or step is too big, or if the data is unshaped.
 */
export const strideTricks = <T = any>(strideSize: number, step = Math.floor(strideSize / 2)) => (target: TObserver<T[]>): TObserver<T[][]> => {
  let windowSize = -1;
  let totalSteps = -1;
  let resultSize = -1;
  let needExtraStep = false;
  return target
    .tap((buffer) => {
      if (windowSize === -1) {
        windowSize = buffer.length;
        totalSteps = Math.ceil((windowSize - strideSize) / step);
        needExtraStep = totalSteps * strideSize !== windowSize;
        resultSize = totalSteps + (needExtraStep ? 1 : 0);
        if (strideSize > windowSize || step > strideSize) throw new Error('react-declarative strideTricks too big stride');
      }
    })
    .flatMap((buffer) => {

      if (buffer.length !== windowSize) {
        throw new Error('react-declarative strideTricks unshaped data');
      }

      const strides: T[][] = [];

      for (let i = 0; i !== totalSteps; i++) {
        const startPos = i * step;
        strides.push(
          buffer.slice(startPos, startPos + strideSize)
        );
      }

      if (needExtraStep) {
        const lastStep = buffer.slice(windowSize - strideSize, windowSize);
        // @ts-ignore
        lastStep["lastStep"] = true;
        strides.push(lastStep);
      }

      return strides.flat(1);
    })
    .reduce<T[]>((acm, cur) => {
      if (acm.length === strideSize) {
        return [cur];
      } else {
        return [...acm, cur];
      }
    }, [])
    .filter((acm) => acm.length === strideSize)
    .reduce<T[][]>((acm, cur) => {
      if (acm.length === resultSize) {
        return [cur];
      } else {
        return [...acm, cur];
      }
    }, [])
    .filter((acm) => acm.length === resultSize)
};

export default strideTricks;
