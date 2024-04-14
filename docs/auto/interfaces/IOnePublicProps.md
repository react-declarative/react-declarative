# IOnePublicProps

Represents the interface for the public properties of the class IOnePublicProps.

## Properties

### data

```ts
data: Data
```

Represents an alternative way to provide data into
component except `handler`. The casual way more native to React developers

### onFocus

```ts
onFocus: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Represents an optional onFocus event handler.

### onBlur

```ts
onBlur: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

### onMenu

```ts
onMenu: (name: string, action: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Represents the optional 'onMenu' property of type `IOneProps&lt;Data, Payload, Field&gt;['menu']`.
This property is used to define the event handler function when a menu action is triggered.
The event handler will receive three arguments: `data`, `payload`, and `field`.

### onReady

```ts
onReady: () => void
```

Represents the `onReady` property of `IOneProps`.

### onChange

```ts
onChange: (Data: Data, initial: boolean) => void
```

The `onChange` function is an optional property of the `IOneProps` interface.
It represents the callback function that is invoked when a change event occurs.

### onClick

```ts
onClick: (name: string, data: Data, payload: Payload, onValueChange: (value: Value) => void, onChange: (data: Data) => void) => void
```

Represents a callback function that gets triggered when an onClick event occurs.

### onInvalid

```ts
onInvalid: (name: string, msg: string, payload: Payload) => void
```

Represents the onInvalid callback function, an optional property of the IOneProps interface.
This function is executed when the invalidity condition is met.

### onLoadStart

```ts
onLoadStart: (source: string) => void
```

Represents the `onLoadStart` event handler of a component.

### onLoadEnd

```ts
onLoadEnd: (isOk: boolean, source: string) => void
```

Represents the optional `onLoadEnd` property of the `IOneProps` interface.

This property defines a callback function that is invoked when the loading of data ends.

### features

```ts
features: string[] | Record<string, Value> | (() => string[] | Record<string, Value>)
```
