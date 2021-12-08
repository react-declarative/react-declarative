import * as React from 'react';

interface IAttributeCollection {
    [name: string]: unknown;
}

type Locale = Record<string, string>;

const createElementRef = React.createElement;

export class Translate {

    private readonly _skip = new Set<string>();

    private readonly _map = new Map<string, string>();

    get skipList() {
        return [...this._skip];
    };

    constructor(
        locale: Locale = {},
    ) {
        Object.entries(locale).forEach(([k, v]) => this._map.set(k, v));
    };

    private tr = (key: string): string => {
        if (this._map.has(key)) {
            return this._map.get(key) || '';
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

export const register = (locale: Locale = {}) => {
    const translate = new Translate(locale);
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
