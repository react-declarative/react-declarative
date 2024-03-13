# PortalView

Extends `React.Component<IPortalViewProps>`

## Constructor

```ts
constructor(props: IPortalViewProps | Readonly<IPortalViewProps>);
constructor(props: IPortalViewProps, context: any);
```

## Properties

### element

```ts
element: HTMLDivElement
```

## Methods

### componentWillUnmount

```ts
componentWillUnmount(): void;
```

Called immediately before a component is destroyed. Perform any necessary cleanup in this method, such as
cancelled network requests, or cleaning up any DOM elements created in `componentDidMount`.

### render

```ts
render(): React.ReactPortal;
```
