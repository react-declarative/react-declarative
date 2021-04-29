import * as React from "react";
import { useState, useLayoutEffect, useRef } from "react";
import { debounce } from "@material-ui/core";

declare var ResizeObserver: any;

export interface ISize {
  height: number;
  width: number;
}

interface IAutoSizerProps {
  children: (s: ISize) => any;
  className?: string;
  defaultHeight?: number;
  defaultWidth?: number;
  disableHeight?: boolean;
  disableWidth?: boolean;
  nonce?: string;
  onResize?: (s: ISize) => void;
  style?: React.CSSProperties;
  target?: HTMLElement;
  delay?: number;
}

export const AutoSizer = ({
  defaultHeight = 0,
  defaultWidth = 0,
  onResize = () => null,
  disableHeight = false,
  disableWidth = false,
  style = {},
  className,
  children,
  target,
  delay = 100,
}: IAutoSizerProps) => {
  const autoSizer = useRef<HTMLDivElement>(null as never);

  const [state, setState] = useState<ISize>({
    height: defaultHeight,
    width: defaultWidth,
  });

  useLayoutEffect(() => {
    const { current } = autoSizer;
    const { parentElement } = current;

    const element = target || parentElement!;

    const handler = () => {
      let { height, width } = element.getBoundingClientRect();
      const style = getComputedStyle(element);

      width -= parseFloat(style.paddingLeft);
      width -= parseFloat(style.paddingRight);

      height -= parseFloat(style.paddingTop);
      height -= parseFloat(style.paddingBottom);

      let isOk = state.height !== height;
      isOk = isOk || state.width !== width;

      if (isOk) {
        setState({ height, width });
        onResize({ height, width });
      }
    };

    const observer = new ResizeObserver(
      debounce(handler, delay)
    );

    observer.observe(element);

    handler();

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [disableHeight, disableWidth, state, delay, onResize]);

  const { height, width } = state;

  const outerStyle: React.CSSProperties = {
    overflow: "visible",
    height,
    width,
  };

  const childParams: ISize = { height, width };

  if (disableHeight) {
    delete outerStyle.height;
  }

  if (disableWidth) {
    delete outerStyle.width;
  }

  return (
    <div
      className={className}
      ref={autoSizer}
      style={{
        ...outerStyle,
        ...style,
      }}
    >
      {children(childParams)}
    </div>
  );
};

export default AutoSizer;
