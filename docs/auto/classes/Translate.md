# Translate

Translate class for handling text translation and transformation.

## Constructor

```ts
constructor(locale: Locale, transform: (str: string) => string, config: Partial<ITranslateConfig>);
```

## Properties

### config

```ts
config: Partial<ITranslateConfig>
```

### translateText

```ts
translateText: (text: string) => string
```

### use

```ts
use: (middleware: Middleware) => void
```

### createElement

```ts
createElement: (type: string, props: IAttributeCollection, ...children: any[]) => any
```

### jss

```ts
jss: (type: string, props: IAttributeCollection) => React.ReactElement<{}, any>
```

### install

```ts
install: (locale?: Locale, transform?: (str: string) => string, config?: Partial<ITranslateConfig>) => Translate
```

### clear

```ts
clear: () => void
```
