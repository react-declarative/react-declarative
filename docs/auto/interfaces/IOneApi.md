# IOneApi

Represents an interface for interacting with the One component by api ref.

## Properties

### reload

```ts
reload: () => Promise<void>
```

Reloads the current page.

### change

```ts
change: (data: Data, initial?: boolean) => void
```

Changes the provided data.

### getData

```ts
getData: () => Data
```

Retrieves the data.
