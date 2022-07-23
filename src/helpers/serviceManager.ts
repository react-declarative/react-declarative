type Key = string | symbol;

interface IService {
    prefetch?: () => Promise<void>;
}

class ServiceManager {

    private readonly _creators = new Map<Key, () => unknown>();
    private readonly _instances = new Map<Key, unknown>();

    private readonly _resolutionOrder: Key[] = [];

    private _checkCircularDependency = (key: Key) => {
        const lastIndex = this._resolutionOrder.lastIndexOf(key);
        if (lastIndex !== -1) {
            const { length: len } = this._resolutionOrder;
            const path = this._resolutionOrder.slice(Math.max(lastIndex - 1, 0), len);
            console.warn('react-declarative serviceManager circular dependency', path.join('-'));
            throw new Error('Circular Dependency detected');
        } else {
            this._resolutionOrder.push(key);
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
            const instance = this._creators.get(key)!();
            this._instances.set(key, instance);
            return instance as T;
        } else {
            verbose && console.warn('serviceManager unknown service', key);
            return null as never;
        }
    };

    prefetch = async () => {
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
    };

    clear = () => {
        this._creators.clear();
        this._instances.clear();
    };

};

type IServiceManager = {
    [P in keyof InstanceType<typeof ServiceManager>]: InstanceType<typeof ServiceManager>[P];
};

export const serviceManager = new class implements IServiceManager {
    _serviceManager = new ServiceManager();
    registerInstance = <T = unknown>(key: Key, inst: T) => this._serviceManager.registerInstance<T>(key, inst);
    registerCreator = <T = unknown>(key: Key, ctor: () => T) => this._serviceManager.registerCreator<T>(key, ctor);
    prefetch = async () => await this._serviceManager.prefetch();
    inject = <T = unknown>(key: Key, verbose = true): T => this._serviceManager.inject<T>(key, verbose);
    clear = () => this._serviceManager.clear();
};

const {
    registerCreator: provide,
    inject,
} = serviceManager;

export {
    provide,
    inject,
};

export const createServiceManager = () => {
    const localServiceManager = new ServiceManager();

    const inject = <T = unknown>(key: Key): T => {
        const localInstance = localServiceManager.inject<T>(key, false);
        if (localInstance) {
            return localInstance;
        } else {
            return serviceManager.inject<T>(key);
        }
    };

    return {
        serviceManager: localServiceManager,
        provide: serviceManager.registerCreator,
        inject,
    };
};

export default createServiceManager;
