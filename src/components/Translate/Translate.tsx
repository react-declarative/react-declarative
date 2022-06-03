import * as React from 'react';

interface IAttributeCollection {
    [name: string]: unknown;
}

type Locale = Record<string, string>;

const createElementRef = React.createElement;

export class Translate {

    private readonly _skip = new Set<string>();

    private readonly _map = new Map<string, string>();

    private readonly _transformed = new Map<string, string>();

    get skipList() {
        return [...this._skip];
    };

    constructor(
        locale: Locale = {},
        readonly transform?: (str: string) => string,
    ) {
        Object.entries(locale).forEach(([k, v]) => this._map.set(k, v));
    };

    private tryTransform = (key: string): string | null => {
        if (this.transform) {
            if (this._transformed.has(key)) {
                return this._transformed.get(key)!;
            } else {
                const result = this.transform(key);
                if (result !== key) {
                    this._transformed.set(key, result);
                    return result;
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    };

    private tr = (key: string): string => {
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

};

declare global {
    interface Window {
        Translate: Translate;
    }
};

export const register = (locale: Locale = {}, transform?: (str: string) => string) => {
    const translate = new Translate(locale, transform);
    Object.assign(React, {
        createElement: (
            type: string,
            props: IAttributeCollection | null,
            ...children: any[]
        ) => {
            return translate.createElement(
                type,
                props,
                ...children
            );
        }
    });
    window.Translate = translate;
};

export default Translate;
