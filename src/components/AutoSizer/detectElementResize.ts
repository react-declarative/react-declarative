import EventEmitter from "../../utils/rx/EventEmitter";

type Function = (...args: any) => any;

const RESIZE_EVENT = Symbol('resize-event');

/**
 * Creates a utility function to detect element resize events.
 * @returns An object containing two methods: addResizeListener and removeResizeListener.
 */
export const createDetectElementResize = () => {
  
  /**
   * Represents an event manager.
   * @class
   * @classdesc The event manager is responsible for managing and dispatching events.
   */
  const eventManager = new EventEmitter();

  const emit = () => eventManager.emit(RESIZE_EVENT);
  const observer = new ResizeObserver(emit);

  /**
   * Attaches a resize listener to an HTML element.
   *
   * @param element - The HTML element to attach the listener to.
   * @param fn - The callback function to be executed when the element is resized.
   */
  const addResizeListener = (element: HTMLElement, fn: Function) => {
    if (!eventManager.hasListeners) {
      window.addEventListener('resize', emit);
    }
    observer.observe(element);
    eventManager.subscribe(RESIZE_EVENT, fn);
  };

  /**
   * Removes a resize event listener from an element.
   *
   * @param element - The element to remove the listener from.
   * @param fn - The listener function to be removed.
   *
   * @returns
   */
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
