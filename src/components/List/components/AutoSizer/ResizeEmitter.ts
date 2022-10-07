
declare var ResizeObserver: any;

type Callback = () => void;

const DISPOSE_CHECK_DELAY = 10_000;

export class ResizeEmitter {

  private subscribers: Callback[] = [];
  private observer: typeof ResizeObserver;
  private disposeTimeout: NodeJS.Timeout | null = null;

  constructor(
    private target: HTMLElement,
    private onDispose: Callback,
  ) {
    this.observer = new ResizeObserver(this.broadcast);
    this.observer.observe(this.target);
  }

  subscribe = (fn: Callback) => {
    this.subscribers.push(fn);
    this.clearTimeout();
  }

  unsubscribe = (fn: Callback) => {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== fn);
    this.clearTimeout();
    this.tryDispose();
  }

  broadcast = () => {
    this.subscribers.forEach(subscriber => subscriber());
  }

  clearTimeout = () => {
    if (this.disposeTimeout !== null) {
      clearTimeout(this.disposeTimeout);
    }
  }

  tryDispose = () => {
    this.disposeTimeout = setTimeout(() => {
      if (this.subscribers.length === 0) {
        this.observer.unobserve(this.target);
        this.observer.disconnect();
        this.onDispose();
      }
      this.disposeTimeout = null;
    }, DISPOSE_CHECK_DELAY);
  }
}

export default ResizeEmitter;
