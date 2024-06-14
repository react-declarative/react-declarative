interface IArraySet<T = any> extends Array<T> {
    toArray: () => Array<T>;
}

export class ArraySet<T = any> extends Array<T> implements IArraySet<T> {

    private _sourceHash: Set<T>;

    constructor(_source: T[]) {
        super(..._source);
        this._sourceHash = new Set(_source);
    };

    includes = (searchElement: T) => {
        return this._sourceHash.has(searchElement);
    }

    filter: IArraySet['filter'] = (...args: any[]) => {
        const params = args as unknown as [any];
        return new ArraySet(super.filter(...params));
    };

    map: IArraySet['map'] = (...args: any[]) => {
        const params = args as unknown as [any];
        return new ArraySet(super.map(...params));
    };

    push: IArraySet['push'] = (...args) => {
        const result = super.push(...args);
        this._sourceHash = new Set(this);
        return result;
    };

    pop: IArraySet['pop'] = (...args) => {
        const result = super.pop(...args);
        this._sourceHash = new Set(this);
        return result;
    };

    unshift: IArraySet['unshift'] = (...args) => {
        const result = super.unshift(...args);
        this._sourceHash = new Set(this);
        return result;
    };

    shift: IArraySet['shift'] = (...args) => {
        const result = super.shift(...args);
        this._sourceHash = new Set(this);
        return result;
    }

    splice: IArraySet['splice'] = (...args) => {
        const result = super.splice(...(args as unknown as [any]));
        this._sourceHash = new Set(this);
        return result;
    }

    slice: IArraySet['slice'] = (...args) => {
        return new ArraySet(super.slice(...args));
    }

    concat: IArraySet['concat'] = (...args) => {
        return new ArraySet(super.concat(...args));
    }

    toArray = () => new Array(...this);

}

export default ArraySet;
