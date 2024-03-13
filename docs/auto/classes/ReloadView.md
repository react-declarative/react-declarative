# ReloadView

Extends `React.Component<IReloadViewProps>`

## Constructor

```ts
constructor(props: IReloadViewProps | Readonly<IReloadViewProps>);
constructor(props: IReloadViewProps, context: any);
```

## Properties

### _disconnectListener

```ts
_disconnectListener: () => void
```

### doSubscribe

```ts
doSubscribe: () => void
```

### componentDidMount

```ts
componentDidMount: () => void
```

Called immediately after a component is mounted. Setting state here will trigger re-rendering.

### componentDidUpdate

```ts
componentDidUpdate: () => void
```

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

### componentWillUnmount

```ts
componentWillUnmount: () => void
```

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

### render

```ts
render: () => Element
```
