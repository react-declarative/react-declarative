import React from "react";

/**
 * Represents a collection of attributes.
 * @interface
 */
interface IAttributeCollection {
  [name: string]: unknown;
}

/**
 * Represents the configuration options for translation.
 * @interface
 */
export interface ITranslateConfig {
  useRawMark: boolean;
  rawSymbol: string;
  rawCondition: (text: string) => boolean;
}

type Locale = Record<string, string>;
type Middleware = (str: string) => string | null;

const createElementRef = React.createElement;

const TRANSLATE_MARK = Symbol("translated");

/**
 * Function to create an element factory.
 *
 * @param process - A function to process the text before creating the element.
 * @returns - The element factory function.
 *
 * @param type - The type of the element to create.
 * @param props - Optional attribute collection for the element.
 * @param children - Optional children to be appended to the element.
 * @returns - The created DOM element.
 */
const createElementFactory =
  (process: (text: string) => string) =>
  (type: string, props: IAttributeCollection | null, ...children: any[]) => {
    for (let i = 0; i !== children.length; i++) {
      if (typeof children[i] === "string") {
        children[i] = process(children[i]);
      }
    }
    return createElementRef(type, props, ...children);
  };

/**
 * Translate class for handling text translation and transformation.
 */
export class Translate {
  private readonly _skip = new Set<string>();
  private readonly _map = new Map<string, string>();
  private readonly _transformed = new Map<string, string>();
  private readonly _middleware: Middleware[] = [];

  get skipList() {
    return [...this._skip];
  }

  public translateText: (text: string) => string;

  constructor(
    locale: Locale = {},
    private transform?: (str: string) => string,
    readonly config: Partial<ITranslateConfig> = {}
  ) {
    const {
        rawSymbol = '撝',
        useRawMark = false,
        rawCondition = () => true,
    } = config;

    const processRaw = (text: string) => {
        const result = this.tr(text);
        if (result === text) {
            return rawCondition(result) ? rawSymbol : result;
        }
        return result;
    };

    if (useRawMark) {
        this.createElement = createElementFactory(processRaw);
        this.translateText = processRaw;
    } else {
        this.createElement = createElementFactory(this.tr);
        this.translateText = this.tr;
    }

    Object.entries(locale).forEach(([k, v]) =>
      this._map.set(k, this.applyMark(v))
    );
  }

  private tryTransform = (key: string): string | null => {
    if (this.transform) {
      if (this._transformed.has(key)) {
        return this._transformed.get(key)!;
      } else {
        let result = "";
        if (!this._middleware.some((fn) => (result = fn(key) as string))) {
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
      return this._map.get(key) || "";
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

  public createElement: (
    type: string,
    props: IAttributeCollection | null,
    ...children: any[]
  ) => ReturnType<typeof createElementRef>;

  public jss = (type: string, props: IAttributeCollection | null) => {
    const children = Array.isArray(props?.children)
      ? props?.children || []
      : [props?.children];
    return this.createElement(type, props, ...children);
  };

  public static install = (
    ...params: ConstructorParameters<typeof Translate>
  ) => {
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
}

declare global {
  interface Window {
    Translate: Translate;
  }
}

export default Translate;
