# ICardViewAction

Represents an interface for an action in a card view.
This interface extends the Omit&lt;IOption, keyof { isVisible: never; isDisabled: never; }&gt; interface.

## Properties

### isVisible

```ts
isVisible: (row: ItemData, payload: Payload) => boolean | Promise<boolean>
```

### isDisabled

```ts
isDisabled: (row: ItemData, payload: Payload) => boolean | Promise<boolean>
```
