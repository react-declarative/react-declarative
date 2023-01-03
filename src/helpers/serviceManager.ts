import singleshot from "../utils/hof/singleshot";

type Key = string | symbol;

export interface IService {
    prefetch?: () => Promise<void>;
    unload?: () => Promise<void>;
}

class ServiceManager {

    private readonly _creators = new Map<Key, () => unknown>();
    private readonly _instances = new Map<Key, unknown>();

    private _resolutionOrder: Key[] = [];
    private _reverseCounter = 0;

    constructor(private readonly _name = 'root') { }

    private _checkCircularDependency = (key: Key) => {
        const lastIndex = this._resolutionOrder.lastIndexOf(key);
        if (lastIndex !== -1) {
            const { length: len } = this._resolutionOrder;
            const path = this._resolutionOrder.slice(Math.max(lastIndex - 1, 0), len);
            path.push(path[0]);
            console.warn(`react-declarative serviceManager "${this._name}" circular dependency`, path.join('->'));
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

    registerInstance = <T = unknown>(key: Key, inst: T) => {
        this._instances.set(key, inst);
    };

    registerCreator = <T = unknown>(key: Key, ctor: () => T) => {
        this._creators.set(key, ctor);
    };

    inject = <T = unknown>(key: Key, verbose = true): T => {
        if (this._instances.has(key)) {
            const instance = this._instances.get(key);
            return instance as T;
        } else if (this._creators.has(key)) {
            this._checkCircularDependency(key);
            const index = Math.max(this._resolutionOrder.length - 1, 0);
            this._reverseCounter++;
            const instance = this._creators.get(key)!();
            this._reverseCounter--;
            this._updateResolutionOrder(index);
            this._instances.set(key, instance);
            return instance as T;
        } else {
            verbose && console.error(`react-declarative serviceManager ${this._name} unknown service`, key);
            return null as never;
        }
    };

    prefetch = singleshot(async (verbose = true) => {
        this.unload.clear();
        try {
            const resolutionSet = new Set(this._resolutionOrder);
            for (const key of this._resolutionOrder) {
                const instance = this._instances.get(key)! as IService;
                instance.prefetch && await instance.prefetch();
            }
            for (const key of this._instances.keys()) {
                if (!resolutionSet.has(key)) {
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
                const instance = this._instances.get(key)! as IService;
                instance.unload && await instance.unload();
            }
            for (const key of this._instances.keys()) {
                if (!resolutionSet.has(key)) {
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

type IServiceManager = {
    [P in keyof InstanceType<typeof ServiceManager>]: InstanceType<typeof ServiceManager>[P];
};

export const serviceManager = new class implements Omit<IServiceManager, keyof {
    prefetch: never;
    unload: never;
}> {
    _serviceManager = new ServiceManager();
    registerInstance = <T = unknown>(key: Key, inst: T) => this._serviceManager.registerInstance<T>(key, inst);
    registerCreator = <T = unknown>(key: Key, ctor: () => T) => this._serviceManager.registerCreator<T>(key, ctor);
    inject = <T = unknown>(key: Key, verbose = true): T => this._serviceManager.inject<T>(key, verbose);
    prefetch = async (verbose = true) => await this._serviceManager.prefetch(verbose);
    unload = async (verbose = true) => await this._serviceManager.unload(verbose);
    clear = () => this._serviceManager.clear();
};

const {
    registerCreator: provide,
    inject,
    prefetch,
    unload,
} = serviceManager;

export {
    provide,
    inject,
    prefetch,
    unload,
};

export const createServiceManager = (name = 'unknown') => {

    const localServiceManager = new ServiceManager(name);

    const inject = <T = unknown>(key: Key): T => {
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
