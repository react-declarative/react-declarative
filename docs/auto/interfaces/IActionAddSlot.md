# IActionAddSlot

Interface for adding a slot in an action.

## Properties

### action

```ts
action: string
```

### label

```ts
label: string
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

Determines the visibility of an element based on selected rows and payload.

### isDisabled

```ts
isDisabled: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

Checks if the provided rows are disabled based on the given payload.
