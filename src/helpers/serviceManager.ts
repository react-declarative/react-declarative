import compose from "../utils/compose";

export const serviceManager = new class {

    _creators = new Map<string | Symbol, () => unknown>();
    _instances = new Map<string | Symbol, unknown>();

    registerInstance = <T = unknown>(key: string, inst: T) => {
        this._instances.set(key, inst);
    };

    registerCreator = <T = unknown>(key: string | Symbol, ctor: () => T, ...hof: ((t: T) => T)[]) => {
        this._creators.set(key, compose(...hof, ctor) as () => T);
    };

    inject = <T = unknown>(key: string | symbol): T => {
        if (this._instances.has(key)) {
            const instance = this._instances.get(key);
            return instance as T;
        } else if (this._creators.has(key)) {
            const instance = this._creators.get(key)!();
            this._instances.set(key, instance);
            return instance as T;
        } else {
            console.warn('serviceManager unknown service', key);
            return null as never;
        }
    };

    clear = () => {
        this._creators.clear();
        this._instances.clear();
    };

};

export default serviceManager;
