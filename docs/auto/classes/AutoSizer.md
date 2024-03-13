# AutoSizer

Extends `React.Component<
    IAutoSizerProps<T>,
    State
  >`

A component that automatically resizes its children based on its parent element's size.

## Constructor

```ts
constructor(props: IAutoSizerProps<T> | Readonly<IAutoSizerProps<T>>);
constructor(props: IAutoSizerProps<T>, context: any);
```

## Properties

### defaultProps

```ts
defaultProps: Partial<IAutoSizerProps<any>>
```

### lastHeightRequest

```ts
lastHeightRequest: (h: number) => number
```

### lastWidthRequest

```ts
lastWidthRequest: (w: number) => number
```

### state

```ts
state: { height: number; width: number; childHeight: number; childWidth: number; }
```

### _parentNode

```ts
_parentNode: HTMLElement
```

### _autoSizer

```ts
_autoSizer: HTMLElement
```

### _detectElementResize

```ts
_detectElementResize: DetectElementResize
```

### _onResize

```ts
_onResize: () => void
```

### _setRef

```ts
_setRef: (autoSizer: HTMLElement) => void
```

## Methods

### shouldComponentUpdate

```ts
shouldComponentUpdate(nextProps: IAutoSizerProps<T>, nextState: State): boolean;
```

Called to determine whether the change in props and state should trigger a re-render.

`Component` always returns true.
`PureComponent` implements a shallow comparison on props and state and returns true if any
props or states have changed.

If false is returned, `Component#render`, `componentWillUpdate`
and `componentDidUpdate` will not be called.

### componentDidMount

```ts
componentDidMount(): void;
```

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

### componentWillUnmount

```ts
componentWillUnmount(): void;
```

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

### render

```ts
render(): JSX.Element;
```
