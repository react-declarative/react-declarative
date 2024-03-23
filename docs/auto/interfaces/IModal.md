# IModal

Represents a modal component.

## Properties

### id

```ts
id: string
```

### render

```ts
render: ModalRender
```

### onInit

```ts
onInit: () => void | Promise<void>
```

Function called when the component initializes.

### onMount

```ts
onMount: (count: number, stack: IModal[]) => void | Promise<void>
```

Function called when the component mounts.

### onUnmount

```ts
onUnmount: (count: number, stack: IModal[]) => void | Promise<void>
```

Callback function called when unmounting occurs.
