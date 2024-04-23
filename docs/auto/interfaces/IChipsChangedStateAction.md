# IChipsChangedStateAction

Represents an action indicating that chips have changed.

## Properties

### type

```ts
type: "chips-changed"
```

The type of the action.

### chips

```ts
chips: Partial<Record<string | number | symbol, boolean>>
```

The updated chips data.
