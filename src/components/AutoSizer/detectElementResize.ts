import EventEmitter from "../../utils/rx/EventEmitter";

type Function = (...args: any) => any;

const RESIZE_EVENT = Symbol('resize-event');

export const createDetectElementResize = () => {
  
  const eventManager = new EventEmitter();

  const observer = new ResizeObserver(() => eventManager.emit(RESIZE_EVENT));

  const addResizeListener = (element: HTMLElement, fn: Function) => {
    observer.observe(element);
    eventManager.subscribe(RESIZE_EVENT, fn);
  };

  const removeResizeListener = (element: HTMLElement, fn: Function) => {
    observer.unobserve(element);
    eventManager.unsubscribe(RESIZE_EVENT, fn);
  };

  return {
    addResizeListener,
    removeResizeListener,
  };
};

export default createDetectElementResize;
