# ErrorBoundary

Extends `React.Component<
    IErrorBoundaryProps,
    IErrorBoundaryState
  >`

## Constructor

```ts
constructor(props: IErrorBoundaryProps);
```

## Properties

### componentDidUpdate

```ts
componentDidUpdate: () => void
```

Called immediately after updating occurs. Not called for the initial render.

The snapshot is only present if getSnapshotBeforeUpdate is present and returns non-null.

### componentDidCatch

```ts
componentDidCatch: (error: any, errorInfo: any) => void
```

Catches exceptions generated in descendant components. Unhandled exceptions will cause
the entire component tree to unmount.

### render

```ts
render: () => ReactNode
```

## Methods

### getDerivedStateFromError

```ts
static getDerivedStateFromError(): {
    hasError: boolean;
};
```
