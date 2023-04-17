import { TObserver } from "../Observer";

export const strideTricks = <T = any>(strideSize: number, step = Math.floor(strideSize / 2)) => (target: TObserver<T[]>): TObserver<T[]> => {
  let windowSize = -1;
  let totalSteps = -1;
  let needExtraStep = false;
  return target
    .tap((buffer) => {
      if (windowSize === -1) {
        windowSize = buffer.length;
        totalSteps = Math.ceil((windowSize - strideSize) / step);
        needExtraStep = totalSteps * strideSize !== windowSize;
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
};

export default strideTricks;
