import EventEmitter from "../../utils/rx/EventEmitter";

type Function = (...args: any) => any;

const RESIZE_EVENT = Symbol('resize-event');

export const createDetectElementResize = () => {
  
  const eventManager = new EventEmitter();

  const emit = () => eventManager.emit(RESIZE_EVENT);
  const observer = new ResizeObserver(emit);

  const addResizeListener = (element: HTMLElement, fn: Function) => {
    if (!eventManager.hasListeners) {
      window.addEventListener('resize', emit);
    }
    observer.observe(element);
    eventManager.subscribe(RESIZE_EVENT, fn);
  };

  const removeResizeListener = (element: HTMLElement, fn: Function) => {
    observer.unobserve(element);
    eventManager.unsubscribe(RESIZE_EVENT, fn);
    if (!eventManager.hasListeners) {
      window.removeEventListener('resize', emit);
    }
  };

  return {
    addResizeListener,
    removeResizeListener,
  };
};

export default createDetectElementResize;
