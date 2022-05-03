type Dimension = string | number | boolean;

export const constraintManager = new class {
    _cache = new Map<string, Dimension>();
    memoize = (column: string, compute: () => Dimension) => {
        if (!this._cache.has(column)) {
            const value = compute();
            this._cache.set(column, value);
            return value;
        } else {
            return this._cache.get(column);
        }
    };
    clear = () => {
        this._cache.clear();
    };
};

export default constraintManager;
