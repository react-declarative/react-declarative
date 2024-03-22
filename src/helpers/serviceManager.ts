import queued, { CANCELED_SYMBOL } from "../utils/hof/queued";
import singleshot from "../utils/hof/singleshot";

type Key = string | symbol;

/**
 * Represents a service for service lifecycle.
 * @interface
 */
export interface IService {
    prefetch?: () => Promise<void>;
    unload?: () => Promise<void>;
}

/**
 * Represents a reference to an instance of a class.
 *
 * @param name - The name of the instance reference.
 */
const createInstanceRef = (name: string) => class InstanceRef<T extends object> {

    private readonly queueFactory = queued(async (promise: Promise<object>) => await promise);

    private static readonly _waitPool: Promise<object>[] = [];
    private static _keys: (symbol | string)[] = [];

    constructor(key: symbol | string, promise: Promise<T>) {
        InstanceRef._waitPool.push(promise);
        InstanceRef._keys.push(key);
        this.queueFactory(promise).then((instance) => {
            if (instance === CANCELED_SYMBOL) {
                return;
            }
            Object.setPrototypeOf(this, instance);
        });
    }

    public static waitForProvide = async (verbose: boolean) => {
        await Promise.all(this._waitPool.map((instance, idx) => {
            instance.then(() => {
                verbose && console.info(`react-declarative serviceManager ${name} waitForProvide done for ${String(InstanceRef._keys[idx])}`);
            });
            instance.catch((error) => {
                verbose && console.info(`react-declarative serviceManager ${name} waitForProvide error for ${String(InstanceRef._keys[idx])}`);
                throw error;
            });
            return instance;
        }));
    };
};

/**
 * Class representing a Service Manager.
 */
class ServiceManager {

    private readonly InstanceRef = createInstanceRef(this._name);

    private readonly _creators = new Map<Key, () => object>();
    private readonly _instances = new Map<Key, object>();

    private _resolutionOrder: Key[] = [];
    private _reverseCounter = 0;

    constructor(private readonly _name = 'root') { }

    private _checkCircularDependency = (key: Key) => {
        const lastIndex = this._resolutionOrder.lastIndexOf(key);
        if (lastIndex !== -1) {
            const { length: len } = this._resolutionOrder;
            const path = this._resolutionOrder.slice(Math.max(lastIndex - 1, 0), len);
            path.push(path[0]);
            console.warn(`react-declarative serviceManager "${this._name}" circular dependency`, path.map((key) => key.toString()).join('->'));
            throw new Error('Circular Dependency detected');
        } else {
            this._resolutionOrder.push(key);
        }
    };

    private _updateResolutionOrder = (index: number) => {
        if (this._reverseCounter === 0) {
            const beforeInstance = this._resolutionOrder.slice(0, index);
            const afterInstance = this._resolutionOrder.slice(index).reverse();
            this._resolutionOrder = [...beforeInstance, ...afterInstance];
        }
    };

    registerInstance = <T = object>(key: Key, inst: T) => {
        if (this._instances.has(key)) {
            return;
        }
        this._instances.set(key, inst as unknown as object);
    };

    registerCreator = <T = object>(key: Key, ctor: () => (T | Promise<T>)) => {
        if (this._creators.has(key)) {
            return;
        }
        this._creators.set(key, ctor as unknown as () => object);
    };

    inject = <T = object>(key: Key, verbose = true): T => {
        if (this._instances.has(key)) {
            const instance = this._instances.get(key);
            return instance as unknown as T;
        } else if (this._creators.has(key)) {
            this._checkCircularDependency(key);
            const index = Math.max(this._resolutionOrder.length - 1, 0);
            this._reverseCounter++;
            const factoryResult = this._creators.get(key)!();
            const instance = factoryResult instanceof Promise ? new this.InstanceRef(key, factoryResult) : factoryResult;
            this._reverseCounter--;
            this._updateResolutionOrder(index);
            this._instances.set(key, instance);
            return instance as unknown as T;
        } else {
            verbose && console.error(`react-declarative serviceManager ${this._name} unknown service`, key);
            return null as never;
        }
    };

    waitForProvide = singleshot(async (verbose = false) => {
        await this.InstanceRef.waitForProvide(verbose);
    });

    prefetch = singleshot(async (verbose = true) => {
        this.unload.clear();
        try {
            const resolutionSet = new Set(this._resolutionOrder);
            for (const key of this._resolutionOrder) {
                verbose && console.info(`react-declarative serviceManager ${this._name} prefetch ${String(key)}`);
                const instance = this._instances.get(key)! as IService;
                instance.prefetch && await instance.prefetch();
            }
            for (const key of this._instances.keys()) {
                if (!resolutionSet.has(key)) {
                    verbose && console.info(`react-declarative serviceManager ${this._name} prefetch ${String(key)}`);
                    const instance = this._instances.get(key)! as IService;
                    instance.prefetch && await instance.prefetch();
                }
            }
        } catch (e) {
            verbose && console.error(`react-declarative serviceManager ${this._name} prefetch error`, e);
            throw e;
        }
    });

    unload = singleshot(async (verbose = true) => {
        this.prefetch.clear();
        try {
            const resolutionSet = new Set(this._resolutionOrder);
            for (const key of this._resolutionOrder) {
                verbose && console.info(`react-declarative serviceManager ${this._name} unload ${String(key)}`);
                const instance = this._instances.get(key)! as IService;
                instance.unload && await instance.unload();
            }
            for (const key of this._instances.keys()) {
                if (!resolutionSet.has(key)) {
                    verbose && console.info(`react-declarative serviceManager ${this._name} unload ${String(key)}`);
                    const instance = this._instances.get(key)! as IService;
                    instance.unload && await instance.unload();
                }
            }
        } catch (e) {
            verbose && console.error(`react-declarative serviceManager ${this._name} unload error`, e);
            throw e;
        }
    });

    clear = () => {
        this._resolutionOrder = [];
        this._reverseCounter = 0;
        this._creators.clear();
        this._instances.clear();
        this.prefetch.clear();
        this.unload.clear();
    };

};

/**
 * Represents the interface for the IServiceManager class.
 */
type IServiceManager = {
    [P in keyof InstanceType<typeof ServiceManager>]: InstanceType<typeof ServiceManager>[P];
};

declare global {
    interface Window {
        __reactDeclarative_ServiceManager: ServiceManager;
    }
}

/**
 * An implementation of the IServiceManager interface.
 *
 * @class
 */
export const serviceManager = new class implements Omit<IServiceManager, keyof {
    waitForProvide: never;
    prefetch: never;
    unload: never;
}> {
    _serviceManager: ServiceManager;

    constructor() {
        if (!window.__reactDeclarative_ServiceManager) {
            window.__reactDeclarative_ServiceManager = new ServiceManager('global');
        }
        this._serviceManager = window.__reactDeclarative_ServiceManager;
    }

    registerInstance = <T = object>(key: Key, inst: T) => this._serviceManager.registerInstance<T>(key, inst);
    registerCreator = <T = object>(key: Key, ctor: () => (T | Promise<T>)) => this._serviceManager.registerCreator<T>(key, ctor);
    inject = <T = object>(key: Key, verbose = true): T => this._serviceManager.inject<T>(key, verbose);
    waitForProvide = async (verbose = true) => await this._serviceManager.waitForProvide(verbose);
    prefetch = async (verbose = true) => await this._serviceManager.prefetch(verbose);
    unload = async (verbose = true) => await this._serviceManager.unload(verbose);
    clear = () => this._serviceManager.clear();
};

const {
    registerCreator: provide,
    waitForProvide,
    inject,
    prefetch,
    unload,
} = serviceManager;

export {
    provide,
    inject,
    waitForProvide,
    prefetch,
    unload,
};

/**
 * Create a service manager with the given name.
 *
 * @param name - The name of the service manager. Default value is 'unknown'.
 * @returns - An object containing various methods related to the service manager.
 */
export const createServiceManager = (name = 'unknown') => {

    const localServiceManager = new ServiceManager(name);

    const inject = <T = object>(key: Key): T => {
        const localInstance = localServiceManager.inject<T>(key, false);
        if (localInstance) {
            return localInstance;
        } else {
            const globalService = serviceManager.inject<T>(key, false);
            !globalService && console.error(`react-declarative serviceManager ${name} unknown service`, key);
            return globalService;
        }
    };

    const prefetch = async () => {
        await serviceManager.prefetch();
        await localServiceManager.prefetch();
    };

    const unload = async () => {
        await localServiceManager.unload();
    };

    const dispose = async () => {
        await localServiceManager.unload();
        await serviceManager.unload();
    };

    return {
        serviceManager: localServiceManager,
        provide: localServiceManager.registerCreator,
        inject,
        prefetch,
        unload,
        dispose,
    };
};

export default createServiceManager;
