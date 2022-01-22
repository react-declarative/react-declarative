import * as React from "react";
import { useState, useLayoutEffect, useRef } from "react";
import { debounce } from "@mui/material";

import ResizeEmitter from "./ResizeEmitter";

import ISize from "../../../model/ISize";

export interface IChildParams<T extends object = object> extends ISize {
  payload: T;
}

interface IAutoSizerProps<T extends object = object> {
  children: (s: IChildParams<T>) => any;
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
  payload?: T;
}

const EMPTY_PAYLOAD = Object.freeze({});

export const AutoSizer = <T extends object = object>({
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
  payload = EMPTY_PAYLOAD as T,
  delay = 100,
}: IAutoSizerProps<T>) => {
  const autoSizer = useRef<HTMLDivElement>(null as never);
  const initialPayload = useRef(true);

  const [state, setState] = useState<ISize>({
    height: defaultHeight,
    width: defaultWidth,
  });

  useLayoutEffect(() => {
    const { current } = autoSizer;
    const { parentElement } = current;

    const element = target || parentElement!;

    const removeCurrentSize = () => {
      !disableHeight && current.style.removeProperty('height');
      !disableWidth && current.style.removeProperty('width');
    };

    const rollbackSize = (height: number, width: number) => {
      !disableHeight && current.style.setProperty('height', `${height}px`);
      !disableWidth && current.style.setProperty('width', `${width}px`);
    };

    const handler = () => {

      removeCurrentSize();

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
      } else {
        rollbackSize(height, width);
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

    window.addEventListener('resize', handlerD);

    return () => {
      window.removeEventListener('resize', handlerD);
      observer.unsubscribe(handlerD);
      handlerD.clear();
    };
  }, [disableHeight, disableWidth, heightRequest, widthRequest, state, delay, onResize]);

  useLayoutEffect(() => {
    if (payload !== EMPTY_PAYLOAD && !initialPayload.current) {
      setState((state) => ({...state}));
    } else {
      initialPayload.current = false;
    }
  }, [payload]);

  const { height, width } = state;

  const outerStyle: React.CSSProperties = {
    height,
    width,
  };

  const childParams: IChildParams<T> = { height, width, payload };

  if (disableHeight) {
    outerStyle.height = style.height;
  }

  if (disableWidth) {
    outerStyle.width = style.width;
  }

  return (
    <div
      className={className}
      ref={autoSizer}
      style={{
        ...style,
        ...outerStyle,
      }}
    >
      {children(childParams)}
    </div>
  );
};

AutoSizer._emitters = new WeakMap<HTMLElement, ResizeEmitter>();

export default AutoSizer;
