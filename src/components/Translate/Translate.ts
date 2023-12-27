import React from 'react';

interface IAttributeCollection {
    [name: string]: unknown;
}

type Locale = Record<string, string>;
type Middleware = (str: string) => string | null;

const createElementRef = React.createElement;

const TRANSLATE_MARK = Symbol('translated');

export class Translate {

    private readonly _skip = new Set<string>();
    private readonly _map = new Map<string, string>();
    private readonly _transformed = new Map<string, string>();
    private readonly _middleware: Middleware[] = [];

    get skipList() {
        return [...this._skip];
    };

    constructor(
        locale: Locale = {},
        readonly transform?: (str: string) => string,
    ) {
        Object.entries(locale).forEach(([k, v]) => this._map.set(k, this.applyMark(v)));
    };

    private tryTransform = (key: string): string | null => {
        if (this.transform) {
            if (this._transformed.has(key)) {
                return this._transformed.get(key)!;
            } else {
                let result = '';
                if (!this._middleware.some((fn) => result = fn(key) as string)) {
                    result = this.transform(key);
                }
                if (result !== key) {
                    const transformed = this.applyMark(result);
                    this._transformed.set(key, transformed);
                    return transformed;
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    };

    private applyMark = (value: string) => {
        const wrapper = new String(value);
        wrapper[TRANSLATE_MARK] = true;
        return wrapper as string;
    };

    private tr = (key: string): string => {
        if (!key) {
            return key;
        }
        if (key[TRANSLATE_MARK]) {
            return key;
        }
        if (this._skip.has(key)) {
            return key;
        }
        if (this._map.has(key)) {
            return this._map.get(key) || '';
        }
        const transformed = this.tryTransform(key);
        if (transformed !== null) {
            return transformed;
        }
        this._skip.add(key);
        return key;
    };

    public use = (middleware: Middleware) => {
        this._middleware.push(middleware);
    };

    public createElement = (
        type: string,
        props: IAttributeCollection | null,
        ...children: any[]
    ) => {
        for (let i = 0; i !== children.length; i++) {
            if (typeof children[i] === 'string') {
                children[i] = this.tr(children[i]);
            }
        }
        return createElementRef(type, props, ...children);
    };

    public jss = (
        type: string,
        props: IAttributeCollection | null,
    ) => {
        const children = Array.isArray(props?.children) ? props?.children || [] : [props?.children];
        return this.createElement(type, props, ...children);
    };

    public static install = (...params: ConstructorParameters<typeof Translate>) => {
        const translate = new Translate(...params);
        window.Translate = translate;
        Object.assign(React, {
            createElement: translate.createElement,
        });
        return translate;
    };

    public clear = () => {
        this._skip.clear();
        this._transformed.clear();
    };

};

declare global {
    interface Window {
        Translate: Translate;
    }
};

export default Translate;
