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
     * @param asyncFunc - The async function to be queued.
     * @returns - The queued version of the async function.
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
 * Represents a resolution node used in a resolution process.
 *
 * @interface
 */
interface IResolutionNode {
    key: Key;
    nodes: IResolutionNode[];
}

/**
 * @see https://www.planttext.com/
 */
class ResolutionManager {

    private UML_STEP = '\t';

    private  nodeMap = new Map<Key, IResolutionNode>();

    private nodes: IResolutionNode[] = [];
    private entries: IResolutionNode[] = [];

    private provide = 0;

    private canceled = false;

    /**
     * Checks if the current state is the root node state.
     *
     * @returns True if the state is the root node state, otherwise false.
     */
    private get isRootNodeState() {
        return this.provide === 0;
    }

    /**
     * Checks if there is a pending provide state.
     *
     * @private
     * @returns Returns true if there is a pending provide state, otherwise false.
     */
    private get isPendingProvideState() {
        const [lastItem = null] = this.entries;
        return !!lastItem;
    }

    constructor(private readonly _name = 'root') { }

    /**
     * Getting node by key or creates a new one with the given key.
     *
     * @param key - The key for the new node.
     * @returns - The created node.
     */
    private createNode = (key: Key) => {
        const node = this.nodeMap.has(key) ? this.nodeMap.get(key) : this.nodeMap.set(key, { key, nodes: [] }).get(key);
        return node!;
    }

    /**
     * Adds a new entry to the beginning of the 'entries' array and increments the 'provide' count by 1.
     *
     * @param key - The key to be used for creating the new entry.
     */
    beginProvide = (key: Key) => {
        if (this.canceled) {
            return;
        }
        this.entries.unshift(this.createNode(key));
        this.provide += 1;
    };

    /**
     * Decrements the "provide" count and removes the first entry from the "entries" array.
     *
     * @param _ - The input parameter is not used.
     * @returns
     */
    endProvide = (_: Key) => {
        if (this.canceled) {
            return;
        }
        this.entries.shift();
        this.provide -= 1;
    };

    /**
     * Begins the injection process for the given key.
     *
     * @param key - The key to inject.
     * @param verbose - Indicates if the injection process should be logged to the console.
     */
    beginInject = (key: Key, verbose: boolean) => {
        if (this.canceled) {
            return;
        }
        verbose && console.log(`resolutionManager beginInject key=${String(key)} root=${this.isRootNodeState} pending=${this.isPendingProvideState}`);
        const [lastItem] = this.entries;
        const node = this.createNode(key);
        if (this.isRootNodeState) {
            this.nodes.push(node);
        }
        if (this.isPendingProvideState) {
            lastItem.nodes.push(node);
        }
    };

    /**
     * Ends the injection process and logs information if verbose is true.
     *
     * @param key - The key for the injection process.
     * @param verbose - Specifies whether to log the information.
     */
    endInject = (key: Key, verbose: boolean) => {
        if (this.canceled) {
            return;
        }
        verbose && console.log(`resolutionManager endInject key=${String(key)} root=${this.isRootNodeState} pending=${this.isPendingProvideState}`);
    };

    /**
     * Converts a resolution tree to a YAML UML representation.
     * Prints the UML representation to the console and returns it as a string.
     *
     * @returns The YAML UML representation of the resolution tree.
     */
    toYamlUML = () => {
        console.log(`ResolutionManager building UML for ${this._name}`);
        if (this.canceled) {
            console.log(`ResolutionManager collecting UML canceled due to async resolve found`);
            return;
        }
        const lines: string[] = [];
        const process = (items: IResolutionNode[], level = 0) => {
            for (const { key, nodes } of items) {
                const space = [...new Array(level)].fill(this.UML_STEP).join('');
                if (nodes.length) {
                    lines.push(`${space}${String(key)}:`);
                    process(nodes, level + 1);
                } else {
                    lines.push(`${space}${String(key)}: ""`);
                }
            }
        };
        process(this.nodes);
        return ['@startyaml', ...lines, '@endyaml'].join('\n');
    };

    /**
     * Cancels the resolution process.
     * Sets the 'canceled' flag to true,
     * resets the 'provide' value to 0,
     * clears the 'nodeMap' object,
     * and empties the 'nodes' and 'entries' arrays.
     *
     * @function cancelResolution
     * @returns
     */
    cancelResolution = () => {
        this.canceled = true;
        this.provide = 0;
        this.nodeMap.clear();
        this.nodes = [];
        this.entries = [];
    }

}

/**
 * Class representing a Service Manager.
 */
class ServiceManager {

    private readonly InstanceRef = createInstanceRef(this._name);

    private readonly _creators = new Map<Key, () => object>();
    private readonly _instances = new Map<Key, object>();

    private _resolutionOrder: Key[] = [];
    private _reverseCounter = 0;

    private resolutionManager = new ResolutionManager(this._name);

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
        const creator = () => {
            this.resolutionManager.beginProvide(key);
            const result = ctor();
            if (result instanceof Promise) {
                this.resolutionManager.cancelResolution();
            }
            this.resolutionManager.endProvide(key);
            return result as unknown as object;
        };
        this._creators.set(key, creator);
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
            this.resolutionManager.beginInject(key, verbose);
            const instance = this._instances.get(key);
            this.resolutionManager.endInject(key, verbose);
            return instance as unknown as T;
        } else if (this._creators.has(key)) {
            this._checkCircularDependency(key);
            const index = Math.max(this._resolutionOrder.length - 1, 0);
            this._reverseCounter++;
            this.resolutionManager.beginInject(key, verbose);
            const factoryResult = this._creators.get(key)!();
            this.resolutionManager.endInject(key, verbose);
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
     * @param [verbose=false] - Whether to enable verbose mode or not.
     * @returns - A promise that resolves when the specified condition is met.
     *
     */
    waitForProvide = singleshot(async (verbose = false) => {
        await this.InstanceRef.waitForProvide(verbose);
    });

    /**
     * Executes prefetch operation for all service instances in a service manager.
     *
     * @param [verbose=true] - Flag to enable verbose logging.
     * @returns - Promise that resolves when prefetch operation is completed.
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
     * @param verbose - Optional parameter to enable verbose logging.
     * @returns - A promise that resolves when all services are unloaded.
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

    toUML = () => this.resolutionManager.toYamlUML();

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

    toUML = () => this._serviceManager.toUML();
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
