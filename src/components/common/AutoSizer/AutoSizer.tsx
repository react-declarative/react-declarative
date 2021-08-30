import * as React from "react";
import { useState, useLayoutEffect, useRef } from "react";
import { debounce } from "@material-ui/core";

import ResizeEmitter from "./ResizeEmitter";

import ISize from "../../../model/ISize";

interface IAutoSizerProps {
  children: (s: ISize) => any;
  className?: string;
  defaultHeight?: number;
  defaultWidth?: number;
  disableHeight?: boolean;
  disableWidth?: boolean;
  nonce?: string;
  onResize?: (s: ISize) => void;
  heightRequest?: (height: number) => number;
  widthRequest?: (width: number) => number;
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
  heightRequest = (v) => v,
  widthRequest = (v) => v,
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

      height = heightRequest(height);
      width = widthRequest(width);

      let isOk = state.height !== height;
      isOk = isOk || state.width !== width;

      if (isOk) {
        setState({ height, width });
        onResize({ height, width });
      }
    };

    const { _emitters: emitters } = AutoSizer;
    let observer: ResizeEmitter;

    if (emitters.has(element)) {
      observer = emitters.get(element)!;
    } else {
      observer = new ResizeEmitter(element, () => {
        emitters.delete(element);
      });
      emitters.set(element, observer);
    }

    const handlerD = debounce(handler, delay);
    observer.subscribe(handlerD);
    handler();

    return () => {
      observer.unsubscribe(handlerD);
      handlerD.clear();
    };
  }, [disableHeight, disableWidth, heightRequest, widthRequest, state, delay, onResize]);

  const { height, width } = state;

  const outerStyle: React.CSSProperties = {
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

AutoSizer._emitters = new WeakMap<HTMLElement, ResizeEmitter>();

export default AutoSizer;
