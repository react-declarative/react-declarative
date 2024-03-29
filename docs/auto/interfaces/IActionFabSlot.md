# IActionFabSlot

Represents an action slot for a FAB (Floating Action Button).

## Properties

### action

```ts
action: string
```

### label

```ts
label: string
```

### icon

```ts
icon: React.ComponentType<any>
```

### height

```ts
height: number
```

### width

```ts
width: number
```

### isVisible

```ts
isVisible: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

Determines if the element is visible based on the selected rows and payload.

### isDisabled

```ts
isDisabled: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

Determines whether a specific feature is disabled based on the selected rows and payload.
