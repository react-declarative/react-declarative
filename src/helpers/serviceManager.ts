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

    /**
     * Creates a queue factory function that can be used to wrap any async function
     * into a queued version. The queued version ensures that only one instance of
     * the async function is executed at a time, queuing subsequent calls until the
     * previous one completes.
     *
     * @param {Function} asyncFunc - The async function to be queued.
     * @returns {Function} - The queued version of the async function.
     * @throws {TypeError} - If the input parameter is not a function.
     */
    private readonly queueFactory = queued(async (promise: Promise<object>) => await promise);

    private static readonly _waitPool: Promise<object>[] = [];
    private static _keys: (symbol | string)[] = [];

    /**
     * @constructor
     * @param key - The key for the instance.
     * @param promise - The promise to be added to the wait pool.
     */
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

    /**
     * A function that waits for promises in a pool to be resolved or rejected.
     *
     * @param verbose - Specifies whether or not to output logs.
     * @returns - A promise that is resolved when all promises in the pool are resolved or rejected.
     */
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

    /**
     * Checks for circular dependency in the resolution order of a key.
     * If a circular dependency is found, it throws an error.
     * Otherwise, it adds the key to the resolution order.
     *
     * @param key - The key to be checked for circular dependency.
     *
     * @throws {Error} Circular Dependency detected
     *
     */
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

    /**
     * Updates the resolution order of a variable.
     *
     * @param index - The index at which the resolution order needs to be updated.
     * @returns
     */
    private _updateResolutionOrder = (index: number) => {
        if (this._reverseCounter === 0) {
            const beforeInstance = this._resolutionOrder.slice(0, index);
            const afterInstance = this._resolutionOrder.slice(index).reverse();
            this._resolutionOrder = [...beforeInstance, ...afterInstance];
        }
    };

    /**
     * Registers an instance with a given key.
     *
     * @template T - The type of the instance.
     * @param key - The key to register the instance with.
     * @param inst - The instance to register.
     * @returns
     */
    registerInstance = <T = object>(key: Key, inst: T) => {
        if (this._instances.has(key)) {
            return;
        }
        this._instances.set(key, inst as unknown as object);
    };

    /**
     * Registers a creator function for a given key.
     *
     * @param key - The unique key to identify the creator function.
     * @param ctor - The constructor function that creates an instance of type T.
     * @template T - The type of the object created by the constructor function.
     * @returns
     */
    registerCreator = <T = object>(key: Key, ctor: () => (T | Promise<T>)) => {
        if (this._creators.has(key)) {
            return;
        }
        this._creators.set(key, ctor as unknown as () => object);
    };

    /**
     * Injects a service instance based on the provided key.
     *
     * @template T - The type of the service instance.
     * @param key - The key of the service.
     * @param [verbose=true] - Whether to display console errors when the service is unknown.
     * @returns - The service instance.
     * @throws {never} - Throws an error if the service is unknown and `verbose` is `true`.
     */
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

    /**
     * A variable that represents a single shot function for waiting until a specific condition is met.
     *
     * @typedef {Function} waitForProvide
     * @param {boolean} [verbose=false] - Whether to enable verbose mode or not.
     * @returns {Promise} - A promise that resolves when the specified condition is met.
     *
     */
    waitForProvide = singleshot(async (verbose = false) => {
        await this.InstanceRef.waitForProvide(verbose);
    });

    /**
     * Executes prefetch operation for all service instances in a service manager.
     *
     * @param {boolean} [verbose=true] - Flag to enable verbose logging.
     * @returns {Promise<void>} - Promise that resolves when prefetch operation is completed.
     * @throws {Error} - Throws an error if an error occurs during prefetch operation.
     */
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

    /**
     * Unload function that unloads services and clears prefetch.
     *
     * @param {boolean} verbose - Optional parameter to enable verbose logging.
     * @returns {Promise} - A promise that resolves when all services are unloaded.
     * @throws {Error} - If any error occurs during the unload process.
     */
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

    /**
     * Clears the state of the current instance.
     * Resets the resolution order, reverse counter, creators, instances, prefetch, and unload.
     *
     * @function clear
     * @memberof <YourPackageName>
     * @instance
     * @returns
     */
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

    /**
     * Registers an instance with the service manager.
     *
     * @param key - The key for the registered instance.
     * @param inst - The instance to be registered.
     * @returns
     */
    registerInstance = <T = object>(key: Key, inst: T) => this._serviceManager.registerInstance<T>(key, inst);
    /**
     * Registers a creator function for a given key.
     *
     * @param key - The key to associate with the creator function.
     * @param ctor - The creator function that returns the desired object or a promise resolving to the desired object.
     * @returns
     */
    registerCreator = <T = object>(key: Key, ctor: () => (T | Promise<T>)) => this._serviceManager.registerCreator<T>(key, ctor);
    /**
     * Injects a dependency using the given key and returns an instance of the dependency.
     *
     * @template T - The type of the dependency being injected.
     * @param key - The key used to locate the dependency.
     * @param [verbose=true] - A flag indicating whether verbose logging should be enabled (default is true).
     * @returns - An instance of the dependency.
     */
    inject = <T = object>(key: Key, verbose = true): T => this._serviceManager.inject<T>(key, verbose);
    /**
     * Wait for the service to be provided.
     *
     * @async
     * @param verbose - Whether to output verbose logs.
     * @returns - A promise that resolves when the service is provided.
     */
    waitForProvide = async (verbose = true) => await this._serviceManager.waitForProvide(verbose);
    /**
     * Prefetches data using the `_serviceManager.prefetch` method.
     *
     * @param [verbose=true] - Specifies whether to enable verbose mode.
     * @returns - A promise that resolves when the prefetching is complete.
     */
    prefetch = async (verbose = true) => await this._serviceManager.prefetch(verbose);
    /**
     * Unloads a resource using the _serviceManager.
     *
     * @async
     * @param [verbose=true] - Whether to output verbose information. Default value is true.
     * @returns - A promise that resolves when the resource is unloaded.
     */
    unload = async (verbose = true) => await this._serviceManager.unload(verbose);
    /**
     * Clears the service.
     *
     * @memberOf SomeClass
     * @function
     * @name clear
     * @instance
     *
     * @returns Returns nothing.
     */
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

    /**
     * Asynchronously prefetches data from the service and local service managers.
     *
     * @returns
     */
    const prefetch = async () => {
        await serviceManager.prefetch();
        await localServiceManager.prefetch();
    };

    /**
     * Unload function
     * @async
     * @function unload
     * @returns - A promise that resolves once the unload process is complete
     */
    const unload = async () => {
        await localServiceManager.unload();
    };

    /**
     * Disposes the local service and service managers.
     *
     * @async
     * @function dispose
     * @returns Promise that resolves when the local service and service managers are unloaded.
     */
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
