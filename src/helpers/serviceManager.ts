import compose from "../utils/compose";

type Key = string | Symbol;

interface IService {
    prefetch?: () => Promise<void>;
}

export const serviceManager = new class {

    _creators = new Map<Key, () => unknown>();
    _instances = new Map<Key, unknown>();

    _resolutionOrder: Key[] = [];

    _checkCircularDependency = (key: Key) => {
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

    registerCreator = <T = unknown>(key: Key, ctor: () => T, ...hof: ((t: T) => T)[]) => {
        this._creators.set(key, compose(...hof, ctor) as () => T);
    };

    inject = <T = unknown>(key: Key): T => {
        if (this._instances.has(key)) {
            const instance = this._instances.get(key);
            return instance as T;
        } else if (this._creators.has(key)) {
            this._checkCircularDependency(key);
            const instance = this._creators.get(key)!();
            this._instances.set(key, instance);
            return instance as T;
        } else {
            console.warn('serviceManager unknown service', key);
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

export default serviceManager;
