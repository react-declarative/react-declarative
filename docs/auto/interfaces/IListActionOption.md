# IListActionOption

Represents an option for a list action.

## Properties

### isVisible

```ts
isVisible: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

Check if a specific condition is satisfied for the visibility of an element.

### isDisabled

```ts
isDisabled: (selectedRows: RowData[], payload: Payload) => boolean | Promise<boolean>
```

Checks whether the entity is disabled based on the provided selected rows and payload.
