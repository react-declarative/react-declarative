# IOnePublicProps

Represents the interface for the public properties of the class IOnePublicProps.

## Properties

### onFocus

```ts
onFocus: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### onBlur

```ts
onBlur: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### onMenu

```ts
onMenu: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### onReady

```ts
onReady: () => void
```

### onChange

```ts
onChange: (Data: Data, initial: boolean) => void
```

### onClick

```ts
onClick: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### onInvalid

```ts
onInvalid: (name: string, msg: string, payload: Payload) => void
```

### onLoadStart

```ts
onLoadStart: (source: string) => void
```

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean, source: string) => void
```

### features

```ts
features: string[] | Record<string, Value> | (() => string[] | Record<string, Value>)
```
