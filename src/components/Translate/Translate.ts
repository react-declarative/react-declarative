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

  /**
   * Translates the given text to another language.
   *
   * @param {string} text - The text to be translated.
   * @returns {string} The translated text.
   */
  public translateText: (text: string) => string;

  /**
   * Constructs a new instance of the Translator class.
   *
   * @param [locale={}] - An object representing the initial locale configuration.
   * @param [transform] - A function for transforming strings.
   * @param [config={}] - An object representing additional configuration options.
   * @return
   */
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

    /**
     * Processes the raw text by applying transformations and conditions.
     *
     * @param text - The raw text to be processed.
     * @returns The processed text.
     */
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

  /**
   * Transforms the given key using a transformation function and middleware.
   *
   * @param key - The key to transform.
   * @returns - The transformed key or null if no transformation is possible.
   */
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

  /**
   * Apply mark to a given string value.
   * @param value - The value to apply mark to.
   * @return - The value with mark applied.
   */
  private applyMark = (value: string) => {
    const wrapper = new String(value);
    wrapper[TRANSLATE_MARK] = true;
    return wrapper as string;
  };

  /**
   * Translates the given key to its corresponding value, if available.
   * If the key is empty or already marked for translation, it is returned as is.
   * If the key is in the skip list, it is returned as is.
   * If the key is in the translation map, its corresponding value is returned.
   * If the key cannot be transformed, it is marked for skip and returned as is.
   *
   * @param key - The key to be translated.
   * @returns - The translated value or the key itself.
   */
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

  /**
   * Adds a middleware to the list of used middlewares.
   *
   * @param middleware - The middleware to be added.
   */
  public use = (middleware: Middleware) => {
    this._middleware.push(middleware);
  };

  /**
   * Creates and returns an element based on the provided type, props, and children.
   *
   * @param {string} type - The type of the element to create.
   * @param {IAttributeCollection | null} props - The properties or attributes to assign to the element.
   * @param {...any[]} children - The child elements or content to append to the element.
   * @returns {ReturnType<typeof createElementRef>} - The created element.
   */
  public createElement: (
    type: string,
    props: IAttributeCollection | null,
    ...children: any[]
  ) => ReturnType<typeof createElementRef>;

  /**
   * Create an element using the given type and props
   * @param type - The type of the element
   * @param props - The props for the element
   * @returns - The created element
   */
  public jss = (type: string, props: IAttributeCollection | null) => {
    const children = Array.isArray(props?.children)
      ? props?.children || []
      : [props?.children];
    return this.createElement(type, props, ...children);
  };

  /**
   * Installs the Translate object and configures React.
   *
   * @param params - The parameters needed to create a new Translate instance.
   * @returns The installed Translate object.
   */
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

  /**
   * Clear the _skip and _transformed variables.
   *
   * @function
   */
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
